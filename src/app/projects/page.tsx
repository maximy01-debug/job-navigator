"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ExternalLink, Github, Globe } from "lucide-react"

// Mock data
const mockProjects = [
  {
    id: '1',
    title: '날씨 앱 프로젝트',
    description: 'OpenWeather API를 활용한 실시간 날씨 정보 제공 웹 애플리케이션. 현재 위치 기반 날씨, 5일 예보, 시간별 날씨 정보를 제공합니다.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'OpenWeather API'],
    tags: ['#웹개발', '#API연동', '#React'],
    imageUrl: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=400&fit=crop',
    githubUrl: 'https://github.com/username/weather-app',
    liveUrl: 'https://weather-app-demo.vercel.app',
    createdAt: '2024년 2월 10일'
  },
  {
    id: '2',
    title: '할 일 관리 앱',
    description: 'React와 로컬 스토리지를 활용한 간단한 TODO 리스트 앱. 할 일 추가, 완료, 삭제 기능과 필터링 기능을 구현했습니다.',
    techStack: ['React', 'JavaScript', 'CSS3', 'LocalStorage'],
    tags: ['#React', '#CRUD', '#반응형'],
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop',
    githubUrl: 'https://github.com/username/todo-app',
    liveUrl: 'https://todo-app-demo.vercel.app',
    createdAt: '2024년 1월 25일'
  },
  {
    id: '3',
    title: '포트폴리오 웹사이트',
    description: 'Next.js를 활용한 개인 포트폴리오 웹사이트. 반응형 디자인과 다크모드를 지원하며, Framer Motion으로 애니메이션을 추가했습니다.',
    techStack: ['Next.js', 'TypeScript', 'Framer Motion', 'Vercel'],
    tags: ['#Next.js', '#포트폴리오', '#애니메이션'],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    githubUrl: 'https://github.com/username/portfolio',
    liveUrl: 'https://portfolio-demo.vercel.app',
    createdAt: '2024년 1월 15일'
  },
  {
    id: '4',
    title: '학교 급식 메뉴 앱',
    description: 'NEIS API를 활용하여 우리 학교의 급식 메뉴를 확인할 수 있는 웹 애플리케이션. 월별 캘린더 뷰와 알레르기 정보를 제공합니다.',
    techStack: ['Vue.js', 'JavaScript', 'NEIS API', 'Bootstrap'],
    tags: ['#Vue', '#공공데이터', '#학교프로젝트'],
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
    githubUrl: 'https://github.com/username/school-meal',
    liveUrl: null,
    createdAt: '2023년 12월 20일'
  }
]

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                📁 나의 프로젝트
              </h1>
              <p className="text-muted-foreground">
                학습 과정에서 만든 프로젝트들을 모아둔 포트폴리오입니다
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              프로젝트 추가
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{mockProjects.length}</div>
                <div className="text-sm text-muted-foreground mt-1">총 프로젝트</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">12</div>
                <div className="text-sm text-muted-foreground mt-1">사용 기술</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">3</div>
                <div className="text-sm text-muted-foreground mt-1">배포 완료</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">8</div>
                <div className="text-sm text-muted-foreground mt-1">진행 중</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {mockProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              {/* Project Image */}
              {project.imageUrl && (
                <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Tech Stack */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2">기술 스택</div>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div className="text-xs text-muted-foreground">
                  생성일: {project.createdAt}
                </div>

                {/* Links */}
                <div className="flex gap-2 pt-2">
                  {project.githubUrl && (
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button size="sm" className="flex-1" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {!project.liveUrl && project.githubUrl && (
                    <Button size="sm" className="flex-1" disabled>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      준비 중
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (프로젝트가 없을 때) */}
        {mockProjects.length === 0 && (
          <Card className="py-16">
            <CardContent className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                  <Plus className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">아직 프로젝트가 없어요</h3>
              <p className="text-muted-foreground mb-6">
                첫 번째 프로젝트를 추가하여 포트폴리오를 시작하세요!
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                프로젝트 추가하기
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add Project CTA */}
        <Card className="mt-8 border-dashed">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">새 프로젝트 추가하기</h3>
            <p className="text-sm text-muted-foreground mb-4">
              수업에서 만든 작품이나 개인 프로젝트를 업로드하세요
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              프로젝트 추가
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
