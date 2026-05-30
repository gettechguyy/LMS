import Link from "next/link";
import { BookOpen, Clock, Star, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export interface CourseCardData {
  slug: string;
  title: string;
  description: string;
  level: string;
  duration_hours: number;
  price: number;
  is_free: boolean;
  tags: string[];
  instructor: string;
  rating: number;
  students: number;
  lessons: number;
}

export function CourseCard({ course }: { course: CourseCardData }) {
  return (
    <Card className="group overflow-hidden border-border/60 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-violet-500/5">
      <div className="relative h-36 bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-indigo-500/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-primary/40 transition-transform group-hover:scale-110" />
        </div>
        <Badge className="absolute left-3 top-3 capitalize" variant="secondary">
          {course.level}
        </Badge>
        {course.is_free && (
          <Badge className="absolute right-3 top-3 bg-emerald-500 text-white hover:bg-emerald-600">
            Free
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <h3 className="line-clamp-2 font-semibold leading-tight group-hover:text-primary">
          {course.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1.5">
          {course.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {course.rating}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {course.students.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.duration_hours}h
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t bg-muted/20 pt-4">
        <span className="font-semibold">
          {course.is_free ? "Free" : formatCurrency(course.price)}
        </span>
        <Button size="sm" asChild className="gradient-primary border-0 text-white">
          <Link href={`/courses/${course.slug}`}>View course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
