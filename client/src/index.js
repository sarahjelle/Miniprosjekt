// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import {Alert, CardView, NavBar} from './widgets';
import {articleService, Article} from './services';
import {Form, Divider, Container, Label, Card, Button, Icon} from 'semantic-ui-react';
// $FlowFixMe
//import 'semantic-ui-css/semantic.min.css';

// Reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
  let script = document.createElement('script');
  script.src = '/reload/reload.js';
  if (document.body) document.body.appendChild(script);
}

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component{
  render(){
    return(
        <NavBar>
            <NavBar.Link to={"/nyheter"}>Hjem</NavBar.Link>
            <NavBar.Link to={"/nyheter/Teknologi"}>Teknologi</NavBar.Link>
            <NavBar.Link to={"/nyheter/Sport"}>Sport</NavBar.Link>
            <NavBar.Link to={"/nyheter/Kultur"}>Kultur</NavBar.Link>
            <NavBar.Link to={"/registrerArtikkel"}>Registrer sak</NavBar.Link>
        </NavBar>
    );
  }
}

class Ticker extends Component{
    articles = [];
    render(){
        return(
            <div className="scrollmenu">
                {this.articles.map(article => (
                    <div className="scrollmenuItem">
                        <NavLink exact to={'/nyheter/' + article.kategori + '/' + article.artikkel_id}  key={article.artikkel_id}>
                            <Card>
                                <Card.Content>
                                    <Card.Header className="wrapText">{article.overskrift}</Card.Header>
                                    <Card.Meta>
                                        <span className='date'>{article.tid}</span>
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        </NavLink>
                    </div>
                ))}
            </div>
        );
    }

    mounted(){
        articleService
            .getArticles()
            .then(articles => (this.articles = articles))
            .catch((error: Error) => Alert.danger(error.message));
    }
}

class Home extends Component {
    articles = [];
    page: number = 0;

    render(){
        console.log(this.articles);
        return(
            <div className="background">
                <Ticker/>
                <div className='container'>
                    <div className="grid">
                        {this.articles.map(article => (
                            <NavLink exact to={'/nyheter/' + article.kategori + '/' + article.artikkel_id} key={article.artikkel_id}>
                                <CardView title={article.overskrift}
                                          picture={article.bilde}
                                          ingress={article.ingress}/>

                            </NavLink>
                        ))}
                    </div>
                    <div>
                        <Button content='Forrige' icon='left arrow' labelPosition='left' floated='left' onClick={this.pageDown}/>
                        <Button content='Neste' icon='right arrow' labelPosition='right' floated='right' onClick={this.pageUp}/>
                    </div>
                </div>
            </div>
        );
    }

    pageUp = () => {
        if (this.page < 0) {
            this.page = 0;
        } else {
            this.page++;
        }
        this.fetchPage();
    };

    pageDown = () => {
        if (this.page < 0) {
            this.page = 0;
        } else {
            this.page--;
        }
        this.fetchPage();
    };

    fetchPage = () => {
        articleService
            .getImportant(this.page)
            .then(articles => (this.articles = articles))
            .catch((error: Error) => Alert.danger(error.message));
    };


    mounted() {
        this.fetchPage();
    }
}

class Category extends Component<{match: {params: {kategori: string}}}>{
    articles = [];
    page: number = 0;

    render(){
        console.log(this.articles);
        return(
            <div className="container">
                {this.articles.map(article => (
                    <NavLink exact to={'/nyheter/' +  article.kategori + '/' + article.artikkel_id}    key={article.artikkel_id}>
                        <CardView title={article.overskrift}
                                  picture={article.bilde}
                                  ingress={article.ingress}/>
                    </NavLink>
                ))}
                <div>
                    <Button content='Forrige' icon='left arrow' labelPosition='left' floated='left' onClick={this.pageDown}/>
                    <Button content='Neste' icon='right arrow' labelPosition='right' floated='right' onClick={this.pageUp}/>
                </div>
            </div>
        );
    }

    pageUp = () => {
        if (this.page < 0) {
            this.page = 0;
        } else {
            this.page++;
        }
        this.fetchPage();
    };

    pageDown = () => {
        if (this.page < 0) {
            this.page = 0;
        } else {
            this.page--;
        }
        this.fetchPage();
    };

    fetchPage = () => {
        articleService
            .getArticlesByCategory(this.props.match.params.kategori, this.page)
            .then(articles => (this.articles = articles))
            .catch((error: Error) => Alert.danger(error.message));
    };


    mounted() {
        this.fetchPage();
    }
}

class ArticleView extends Component<{match: {params: {id: number}}}>{
    article = {};

    render(){
        if(!this.article) return null;

        return(
            <div className="container pb-xl-5">
                <Container textAlign="center">
                    <h1>{this.article.overskrift}</h1>
                    <i>{this.article.ingress}</i>
                    <img width="100%" height="auto" src={this.article.bilde} alt={this.article.overskrift}/>
                </Container>
                <Container textAlign="justified">
                    <i>Lagt inn: {this.article.tid}</i>
                    <br/>
                    <i> Skrevet av: {this.article.forfatter}</i>
                    <Divider />
                    <p>{this.article.innhold}</p>
                    <div>
                        <Button as='div' labelPosition='right' floated='left'>
                            <Button color='red'>
                                <Icon name='heart' />
                                Like
                            </Button>
                            <Label as='a' basic color='red' pointing='left'>
                                2,048
                            </Label>
                        </Button>
                        <Button color='red' floated='right' onClick={this.delete}>
                            Delete
                        </Button>
                        <Button color='orange' floated='right' onClick={() => {history.push('/nyheter/' + this.article.kategori + '/' + this.article.artikkel_id + '/edit')}}>
                            Edit
                        </Button>
                    </div>
                </Container>

            </div>
        );
    }
    delete(){
        articleService
            .deleteArticle(this.props.match.params.id)
            .then(history.push('/nyheter'))
            .catch((error: Error) => Alert.danger(error.message));
    }

    mounted(){
        articleService
            .getArticle(this.props.match.params.id)
            .then(article => {(this.article = article[0])})
            .catch((error: Error) => Alert.danger(error.message));
    }
}

type State = {
    forfatter: string,
    overskrift: string,
    ingress: string,
    innhold: string,
    bilde: string,
    kategori: string,
    viktighet: number
}

class NewArticle extends Component<{},State>{
    form = null;
    options = [];
    state = {
        forfatter: '',
        overskrift: '',
        ingress: '',
        innhold: '',
        bilde: '',
        kategori: '',
        viktighet: 2
    }

    handleChange = (e, {name, value}) => this.setState({[name]: value})

    render(){
        return(
            <div className="container">
            <Form>
                <Form.Group widths='equal'>
                    <Form.Input fluid
                                label='Forfatter'
                                placeholder='First name'
                                name='forfatter'
                                onChange={this.handleChange}
                    />
                    <Form.Select fluid label='Kategori'
                                 options={this.options} placeholder='Kategori'
                                 name='kategori'
                                 onChange={this.handleChange}
                    />
                </Form.Group>
                <Form.Checkbox label="Kryss av hvis artikkel er viktig"  name='kategori' onChange={this.getViktighet}/>
                <Form.Input label="Overskrift" placeholder="Overskrift" onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.state.overskrift = event.target.value}/>
                <Form.TextArea label='Bilde' placeholder='Link til bilde...' onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.state.bilde = event.target.value} />
                <Form.TextArea label="Ingress" placeholder='Kort om hva artikkelen handler om...' onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.state.ingress = event.target.value}/>
                <Form.TextArea label="Innhold" placeholder='Innhold...' onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.state.innhold = event.target.value}/>
                <Form.Button onClick={this.save}>Send inn</Form.Button>
            </Form>
            </div>
        );
    }

    getViktighet(e, o) {
        console.log(o);

        this.state.viktighet = o.checked ? 1 : 2;
    }

    save(){
        console.log(this.state.forfatter);
        console.log(this.state.overskrift);
        console.log(this.state.bilde);
        console.log(this.state.ingress);
        console.log(this.state.innhold);
        console.log(this.state.kategori);
        console.log(this.state.viktighet);

        let article: Article = new Article(this.state.overskrift, this.state.ingress, this.state.innhold,
            this.state.kategori, this.state.bilde, this.state.viktighet, this.state.forfatter);

        articleService
            .newArticle(article)
            .then(() => {history.push("/nyheter/" + article.kategori)})
            .catch((error: Error) => Alert.danger(error.message));
    }

    mounted(){
        articleService
            .getCategories()
            .then(categories => (this.options =
                categories.map(e => (
                    {key: e.navn, text: e.navn, value: e.navn}
                ))
            ))
            .catch((error: Error) => Alert.danger(error.message));
    }
}

class EditArticle extends Component<{match: {params: {id: number}}},State>{
    article = {};
    options = [];

    handleChange = (e, {name, value}) => this.setState({[name]: value})

    render(){
        console.log(this.article);
        return(
            <div className="container">
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Input fluid
                                    label='Forfatter'
                                    value={this.article.forfatter}
                                    name='forfatter'
                                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.article.forfatter = event.target.value}
                        />
                        <Form.Select fluid label='Kategori'
                                     options={this.options} value={this.article.kategori}
                                     name='kategori'
                                     onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Checkbox label="Kryss av hvis artikkel er viktig"  name='kategori' onChange={this.getViktighet}/>
                    <Form.Input label="Overskrift" value={this.article.overskrift} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.article.overskrift = event.target.value}/>
                    <Form.TextArea value={this.article.bilde} label='Bilde' input={this.article.bilde} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.article.bilde = event.target.value} />
                    <Form.TextArea label="Ingress" value={this.article.ingress} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.article.ingress = event.target.value}/>
                    <Form.TextArea label="Innhold" value={this.article.innhold} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.article.innhold = event.target.value}/>
                    <Form.Button onClick={this.save}>Lagre</Form.Button>
                </Form>
            </div>
        );
    }

    getViktighet(e, o) {
        console.log(o);

        this.state.viktighet = o.checked ? 1 : 2;
    }

    mounted(){
        articleService
            .getCategories()
            .then(categories => (this.options =
                    categories.map(e => (
                        {key: e.navn, text: e.navn, value: e.navn}
                    ))
            ))
            .catch((error: Error) => Alert.danger(error.message));

        articleService
            .getArticle(this.props.match.params.id)
            .then(article => {
                console.log(article);
                (this.article = article[0]);
            })
            .catch((error: Error) => Alert.danger(error.message));
    }

    save(){
        let article: Article = new Article(this.article.overskrift, this.article.ingress, this.article.innhold,
            this.article.kategori, this.article.bilde, this.article.viktighet, this.article.forfatter);
        articleService
            .updateArticle(article, this.props.match.params.id)
            .then(() => {history.push("/nyheter/" + this.article.kategori + "/" + this.props.match.params.id)})
            .catch((error: Error) => Alert.danger(error.message));
    }
}

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Alert/>
        <Menu/>
        <Route exact path="/nyheter" component={Home} />
        <Route exact path="/nyheter/:kategori" component={Category} />
        <Route exact path="/nyheter/:kategori/:id" component={ArticleView} />
        <Route exact path="/registrerArtikkel" component={NewArticle} />
        <Route exact path="/nyheter/:kategori/:id/edit" component={EditArticle} />
      </div>
    </HashRouter>,
    root
  );
