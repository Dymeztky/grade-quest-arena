// Grade data for the dashboard charts

export interface SubjectGrade {
  subject: string;
  shortName: string;
  value: number;
  fullMark: number;
  trend: string;
}

export interface MonthlyGrade {
  month: string;
  nilai: number;
  target: number;
}

export const subjectGrades: SubjectGrade[] = [
  { subject: "Mathematics", shortName: "MATH", value: 85, fullMark: 100, trend: "+3" },
  { subject: "Physics", shortName: "PHY", value: 78, fullMark: 100, trend: "-2" },
  { subject: "Chemistry", shortName: "CHEM", value: 92, fullMark: 100, trend: "+5" },
  { subject: "Biology", shortName: "BIO", value: 88, fullMark: 100, trend: "+1" },
  { subject: "English", shortName: "ENG", value: 75, fullMark: 100, trend: "+4" },
  { subject: "Indonesian", shortName: "IND", value: 82, fullMark: 100, trend: "0" },
];

export const monthlyGradesBySubject: Record<string, number[]> = {
  "Mathematics": [78, 82, 85, 80, 88, 85, 90],
  "Physics": [75, 78, 72, 80, 76, 82, 78],
  "Chemistry": [85, 88, 90, 92, 89, 94, 92],
  "Biology": [82, 85, 88, 86, 90, 87, 88],
  "English": [70, 72, 75, 78, 73, 76, 75],
  "Indonesian": [80, 82, 78, 85, 83, 80, 82],
};

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

export const defaultTarget = 80;

export const getMonthlyData = (subject: string): MonthlyGrade[] => {
  const values = monthlyGradesBySubject[subject] || [80, 82, 84, 83, 85, 84, 86];
  return months.map((month, i) => ({
    month,
    nilai: values[i],
    target: defaultTarget,
  }));
};

export const getRadarChartData = () => {
  return subjectGrades.map(({ shortName, value, fullMark }) => ({
    subject: shortName,
    value,
    fullMark,
  }));
};

export const getSubjectAverages = () => {
  return subjectGrades.map(({ subject, value, trend }) => ({
    label: subject,
    value,
    trend,
  }));
};

export const getSubjectNames = () => {
  return subjectGrades.map(g => g.subject);
};
