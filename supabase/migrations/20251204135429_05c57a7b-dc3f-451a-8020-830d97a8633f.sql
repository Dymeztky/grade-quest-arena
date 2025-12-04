-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_base TEXT DEFAULT 'default',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_max INTEGER DEFAULT 100,
  coins INTEGER DEFAULT 500,
  streak INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create avatar accessories table
CREATE TABLE public.avatar_accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'hat', 'glasses', 'outfit', 'background'
  price INTEGER NOT NULL DEFAULT 100,
  rarity TEXT DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user owned accessories
CREATE TABLE public.user_accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  accessory_id UUID REFERENCES public.avatar_accessories(id) ON DELETE CASCADE NOT NULL,
  equipped BOOLEAN DEFAULT false,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, accessory_id)
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  target_value INTEGER DEFAULT 80,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create grades table
CREATE TABLE public.grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  value INTEGER NOT NULL,
  period TEXT, -- 'Jan', 'Feb', etc.
  academic_year TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create goals table
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  target_value INTEGER NOT NULL,
  predicted_value INTEGER,
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create friendships table
CREATE TABLE public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Create barter offers table
CREATE TABLE public.barter_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offerer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  offered_accessory_id UUID REFERENCES public.avatar_accessories(id) NOT NULL,
  wanted_accessory_id UUID REFERENCES public.avatar_accessories(id),
  status TEXT DEFAULT 'open', -- 'open', 'accepted', 'declined', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create challenges table for Grim Reaper
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  opponent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  stake_accessory_id UUID REFERENCES public.avatar_accessories(id),
  stake_coins INTEGER DEFAULT 0,
  deadline DATE NOT NULL,
  status TEXT DEFAULT 'open', -- 'open', 'active', 'completed', 'cancelled'
  winner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatar_accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barter_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Avatar accessories policies (public read)
CREATE POLICY "Anyone can view accessories" ON public.avatar_accessories FOR SELECT USING (true);

-- User accessories policies
CREATE POLICY "Users can view own accessories" ON public.user_accessories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own accessories" ON public.user_accessories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own accessories" ON public.user_accessories FOR UPDATE USING (auth.uid() = user_id);

-- Subjects policies (public read)
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);

-- Grades policies
CREATE POLICY "Users can view own grades" ON public.grades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own grades" ON public.grades FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Goals policies
CREATE POLICY "Users can view own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own goals" ON public.goals FOR ALL USING (auth.uid() = user_id);

-- Friendships policies
CREATE POLICY "Users can view own friendships" ON public.friendships FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users can create friendships" ON public.friendships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own friendships" ON public.friendships FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Barter policies
CREATE POLICY "Users can view relevant barters" ON public.barter_offers FOR SELECT USING (auth.uid() = offerer_id OR auth.uid() = receiver_id OR receiver_id IS NULL);
CREATE POLICY "Users can create barter offers" ON public.barter_offers FOR INSERT WITH CHECK (auth.uid() = offerer_id);
CREATE POLICY "Users can update own barters" ON public.barter_offers FOR UPDATE USING (auth.uid() = offerer_id OR auth.uid() = receiver_id);

-- Challenges policies
CREATE POLICY "Users can view challenges" ON public.challenges FOR SELECT USING (auth.uid() = challenger_id OR auth.uid() = opponent_id OR opponent_id IS NULL);
CREATE POLICY "Users can create challenges" ON public.challenges FOR INSERT WITH CHECK (auth.uid() = challenger_id);
CREATE POLICY "Users can update own challenges" ON public.challenges FOR UPDATE USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);

-- Create function to handle new user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', 'Player'),
    COALESCE(NEW.raw_user_meta_data ->> 'preferred_username', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default subjects
INSERT INTO public.subjects (name, short_name, target_value) VALUES
  ('Matematika', 'MTK', 80),
  ('Fisika', 'FIS', 78),
  ('Kimia', 'KIM', 82),
  ('Biologi', 'BIO', 80),
  ('B. Inggris', 'ING', 75),
  ('B. Indonesia', 'IND', 78);

-- Insert default avatar accessories
INSERT INTO public.avatar_accessories (name, description, category, price, rarity, image_url) VALUES
  ('Topi Wizard', 'Topi ajaib untuk sang penyihir akademik', 'hat', 200, 'rare', '🎩'),
  ('Kacamata Nerd', 'Kacamata klasik untuk tampilan cerdas', 'glasses', 100, 'common', '👓'),
  ('Mahkota Emas', 'Untuk raja dan ratu leaderboard', 'hat', 500, 'legendary', '👑'),
  ('Hoodie Gaming', 'Outfit santai tapi tetap keren', 'outfit', 150, 'common', '🧥'),
  ('Sayap Api', 'Background efek api membara', 'background', 300, 'epic', '🔥'),
  ('Aura Neon', 'Background glow neon keren', 'background', 250, 'rare', '✨'),
  ('Headphone Pro', 'Aksesoris untuk gamer sejati', 'glasses', 180, 'rare', '🎧'),
  ('Cape Hero', 'Jubah untuk pahlawan akademik', 'outfit', 400, 'epic', '🦸'),
  ('Topi Santa', 'Edisi spesial musim liburan', 'hat', 150, 'common', '🎅'),
  ('Kacamata VR', 'Teknologi masa depan', 'glasses', 350, 'epic', '🥽');

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();