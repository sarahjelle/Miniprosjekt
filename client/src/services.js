// @flow
import axios from 'axios';
axios.interceptors.response.use(response => response.data);

class Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export class Article{
  artikkel_id: number;
  overskrift: string;
  ingress: string;
  innhold: string;
  kategori: string;
  bilde: string;
  viktighet: number;
  forfatter: string;
  tid: string;

  constructor(overskrift: string, ingress: string, innhold: string, kategori: string, bilde: string, viktighet: number, forfatter: string){
      this.overskrift = overskrift;
      this.ingress = ingress;
      this.innhold = innhold;
      this.kategori = kategori;
      this.bilde = bilde;
      this.viktighet = viktighet;
      this.forfatter = forfatter;
  }
}

class Kategori{
    navn: String;
}

class ArticleService{
    getArticles(): Promise<Article[]>{
        return axios.get('/newsfeed')
    }


    getArticlesByCategory(category: string): Promise<Article[]>{
        return axios.get('/nyheter/' + category);
    }

    getImportant(): Promise<Article[]>{
        return axios.get('/nyheter');
    }

    getCategories(): Promise<Kategori[]>{
        return axios.get('/kategorier');
    }

    getArticle(id: number): Promise<Article[]>{
        return axios.get('/nyheter/kategori/' + id);
    }

    updateArticle(article: Article, id: number): Promise<void>{
        return axios.put('/nyheter/kategori/' + id, article);
    }

    newArticle(article: Article): Promise<void>{
        return axios.post('/newarticle', article);
    }

    deleteArticle(id: number): Promise<void>{
        return axios.delete('/nyheter/kategori/' + id);
    }
}

class StudentService {
  getStudents(): Promise<Student[]> {
    return axios.get('/students');
  }

  getStudent(id: number): Promise<Student> {
    return axios.get('/students/' + id);
  }

  updateStudent(student: Student): Promise<void> {
    return axios.put('/students', student);
  }
}
export let studentService = new StudentService();
export let articleService = new ArticleService();
