// 학생 데이터 타입 정의
export interface Student {
  student_number: number
  name: string
  password: string
  first_login: boolean
  is_data_confirmed: boolean
  department: string
  class_name: string
  gender: string
  clubs_joined: string
  parent_share_consent: string
  photo: string
}

// GitHub에서 가져온 학생 데이터 (students.csv 기반)
export const students: Student[] = [
  { student_number: 1, name: '김민수', password: '1', first_login: true, is_data_confirmed: false, department: '경영회계과', class_name: '9반', gender: '남', clubs_joined: '진로탐색동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/1.jpg' },
  { student_number: 2, name: '이서연', password: '2', first_login: true, is_data_confirmed: false, department: '경영회계과', class_name: '10반', gender: '여', clubs_joined: '진로탐색동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/2.jpg' },
  { student_number: 3, name: '박지훈', password: '3', first_login: true, is_data_confirmed: false, department: '경영회계과', class_name: '11반', gender: '남', clubs_joined: '진로탐색동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/3.jpg' },
  { student_number: 4, name: '최유진', password: '4', first_login: true, is_data_confirmed: false, department: '경영회계과', class_name: '9반', gender: '여', clubs_joined: '진로탐색동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/4.jpg' },
  { student_number: 5, name: '정현우', password: '5', first_login: true, is_data_confirmed: false, department: '전자전기과', class_name: '5반', gender: '남', clubs_joined: '진로탐색동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/5.jpg' },
  { student_number: 6, name: '강서영', password: '6', first_login: true, is_data_confirmed: false, department: '전자전기과', class_name: '5반', gender: '여', clubs_joined: '학생자치동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/6.jpg' },
  { student_number: 7, name: '윤민서', password: '7', first_login: true, is_data_confirmed: false, department: '경영회계과', class_name: '12반', gender: '여', clubs_joined: '학생자치동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/7.jpg' },
  { student_number: 8, name: '조은우', password: '8', first_login: true, is_data_confirmed: false, department: '전자전기과', class_name: '6반', gender: '남', clubs_joined: '학생자치동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/8.jpg' },
  { student_number: 9, name: '임소율', password: '9', first_login: true, is_data_confirmed: false, department: '전자전기과', class_name: '6반', gender: '여', clubs_joined: '학생자치동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/9.jpg' },
  { student_number: 10, name: '한지우', password: '10', first_login: true, is_data_confirmed: false, department: '전자전기과', class_name: '7반', gender: '남', clubs_joined: '학생자치동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/10.jpg' },
  { student_number: 11, name: '신동현', password: '11', first_login: true, is_data_confirmed: false, department: '일반과', class_name: '1반', gender: '남', clubs_joined: '봉사활동동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/11.jpg' },
  { student_number: 12, name: '배호연', password: '12', first_login: true, is_data_confirmed: false, department: '컴퓨터소프트웨어과', class_name: '1반', gender: '여', clubs_joined: '봉사활동동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/12.jpg' },
  { student_number: 13, name: '황승민', password: '13', first_login: true, is_data_confirmed: false, department: '컴퓨터소프트웨어과', class_name: '2반', gender: '남', clubs_joined: '봉사활동동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/13.jpg' },
  { student_number: 14, name: '남승호', password: '14', first_login: true, is_data_confirmed: false, department: '컴퓨터소프트웨어과', class_name: '3반', gender: '남', clubs_joined: '봉사활동동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/14.jpg' },
  { student_number: 15, name: '서지아', password: '15', first_login: true, is_data_confirmed: false, department: '컴퓨터소프트웨어과', class_name: '2반', gender: '여', clubs_joined: '봉사활동동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/15.jpg' },
  { student_number: 16, name: '오해원', password: '16', first_login: true, is_data_confirmed: false, department: '일반과', class_name: '1반', gender: '여', clubs_joined: '문화예술동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/16.jpg' },
  { student_number: 17, name: '송서준', password: '17', first_login: true, is_data_confirmed: false, department: '일반과', class_name: '1반', gender: '남', clubs_joined: '문화예술동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/17.jpg' },
  { student_number: 18, name: '전채원', password: '18', first_login: true, is_data_confirmed: false, department: '스마트미디어과', class_name: '5반', gender: '여', clubs_joined: '문화예술동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/18.jpg' },
  { student_number: 19, name: '곽민혁', password: '19', first_login: true, is_data_confirmed: false, department: '일반과', class_name: '1반', gender: '남', clubs_joined: '문화예술동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/19.jpg' },
  { student_number: 20, name: '노다름', password: '20', first_login: true, is_data_confirmed: false, department: '스마트미디어과', class_name: '4반', gender: '여', clubs_joined: '문화예술동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/20.jpg' },
  { student_number: 21, name: '류시온', password: '21', first_login: true, is_data_confirmed: false, department: '스마트미디어과', class_name: '4반', gender: '남', clubs_joined: '체육동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/21.jpg' },
  { student_number: 22, name: '안태양', password: '22', first_login: true, is_data_confirmed: false, department: '일반과', class_name: '1반', gender: '남', clubs_joined: '학생자치동아리, 봉사활동동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/22.jpg' },
  { student_number: 23, name: '유하준', password: '23', first_login: true, is_data_confirmed: false, department: '인공지능소프트웨어과', class_name: '6반', gender: '남', clubs_joined: '체육동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/23.jpg' },
  { student_number: 24, name: '문해선', password: '24', first_login: true, is_data_confirmed: false, department: '일반과', class_name: '1반', gender: '여', clubs_joined: '체육동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/24.jpg' },
  { student_number: 25, name: '주서윤', password: '25', first_login: true, is_data_confirmed: false, department: '인공지능소프트웨어과', class_name: '7반', gender: '여', clubs_joined: '체육동아리', parent_share_consent: 'No', photo: 'https://api.school.edu/photos/25.jpg' },
]

// 학생 인증 함수
export function authenticateStudent(name: string, studentNumber: string): Student | null {
  const student = students.find(
    s => s.name === name && s.student_number.toString() === studentNumber
  )
  return student || null
}

// 학생 번호로 학생 찾기
export function getStudentByNumber(studentNumber: number): Student | null {
  return students.find(s => s.student_number === studentNumber) || null
}

// 학생 이름으로 학생 찾기
export function getStudentByName(name: string): Student | null {
  return students.find(s => s.name === name) || null
}
