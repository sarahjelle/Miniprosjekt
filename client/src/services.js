// @flow
import axios from 'axios';
axios.interceptors.response.use(response => response.data);

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

class Likes{
    artikkel_id: number;
    antall: number;
}

class ArticleService{
    getArticles(): Promise<Article[]>{
        return axios.get('/newsfeed')
    }


    getArticlesByCategory(category: string, page:number=0): Promise<Article[]>{
        return axios.get('/nyheter/' + category + '?page=' + page);
    }

    getImportant(page:number=0): Promise<Article[]>{
        return axios.get('/nyheter?page=' + page);
    }

    getCategories(): Promise<Kategori[]>{
        return axios.get('/kategorier');
    }

    getArticle(id: number): Promise<Article[]>{
        return axios.get('/nyheter/kategori/' + id);
    }

    getLikes(id: number): Promise<Likes[]>{
        return axios.get('/nyheter/kategori/' + id + '/likes');
    }

    addLikes(id: number, likesFraFor: number): Promise<void>{
        return axios.put('/nyheter/kategori/' + id + '/likes', {likes: likesFraFor});
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

export let articleService = new ArticleService();
