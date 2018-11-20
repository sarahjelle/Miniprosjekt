// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import {Alert, CardView, NavBar} from './widgets';
import {articleService, Article} from './services';
import {List, Header, Form, Divider, Container, Label, Card, Button, Icon, Segment, Grid} from 'semantic-ui-react';

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
            <NavBar.Brand>
                <img src="logo.png" width="150" height="70" className="d-inline-block align-top" alt="logo"/>
            </NavBar.Brand>
            <NavBar.Link to={"/nyheter/Nyheter"}>Nyheter</NavBar.Link>
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
    intervalID: any = null;

    render(){
        return(
            <marquee direction="left" behavior="scroll" scrollamount="8" ref="marq" onMouseOver={() => {this.refs.marq.stop()}} onMouseOut={() => {this.refs.marq.start()}}>
                <div>
                    {this.articles.map(article => (
                        <div className='scrollmenuItem'>
                            <NavLink exact to={'/nyheter/' + article.kategori + '/' + article.artikkel_id}  key={article.artikkel_id}>
                                <Card color='red'>
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
            </marquee>
        );
    }

    mounted(){
        this.refresh();
        const self = this;
        this.intervalID = setInterval(function () {
            self.refresh();
        }, 5000);
    }

    refresh(){
        articleService
            .getArticles()
            .then(articles => (this.articles = articles))
            .catch((error: Error) => Alert.danger(error.message));
        console.log("Refreshing");
    }

    componentWillUnmount(){
        clearInterval(this.intervalID);
    }
}

class Home extends Component {
    articles = [];
    page: number = 0;
    maxPage: number = 0;
    lmtPrPage: number = 20;

    render(){
        console.log(this.articles);
        return(
            <div>
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
                    <Divider hidden/>
                    <Button content='Forrige' floated='left' onClick={this.pageDown}/>
                    <Button content='Neste' floated='right' onClick={this.pageUp}/>
                </div>
            </div>
        );
    }

    pageUp = () => {
        if (this.page < 0) {
            this.page = 0;
        } else {
            this.page = (this.page + 1)%(this.maxPage);
        }
        this.fetchPage();
    };

    pageDown = () => {
        if (this.page <= 0) {
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
        articleService
            .getAntArticles()
            .then(count => {
                this.fetchPage();
                this.maxPage = Math.floor(count[0].antall/this.lmtPrPage) + 1; //Sets max page count
            })
            .catch((error: Error) => Alert.danger(error.message));
        this.fetchPage();
    }
}

class Category extends Component<{match: {params: {kategori: string}}}>{
    articles = [];
    page: number = 0;
    maxPage: number = 0;
    lmtPrPage: number = 20;

    render(){
        console.log(this.articles);
        return(
            <div className="container">
                <div className='grid'>
                    {this.articles.map(article => (
                        <NavLink exact to={'/nyheter/' +  article.kategori + '/' + article.artikkel_id}    key={article.artikkel_id}>
                            <CardView title={article.overskrift}
                                      picture={article.bilde}
                                      ingress={article.ingress}/>
                        </NavLink>
                    ))}
                </div>
                <Divider hidden/>
                <Button content='Forrige' floated='left' onClick={this.pageDown}/>
                <Button content='Neste' floated='right' onClick={this.pageUp}/>
            </div>
        );
    }

    pageUp = () => {
        if (this.page < 0) {
            this.page = 0;
        } else {
            this.page = (this.page + 1)%(this.maxPage);
        }
        this.fetchPage();
    };

    pageDown = () => {
        if (this.page <= 0) {
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
        articleService
            .getAntArticlesCat(this.props.match.params.kategori)
            .then(count => {
                this.fetchPage();
                this.maxPage = Math.floor(count[0].antall/this.lmtPrPage) + 1; //Sets max page count
            })
            .catch((error: Error) => Alert.danger(error.message));
        this.fetchPage();
    }
}

class ArticleView extends Component<{match: {params: {id: number}}}>{
    article = {};
    antLikes: number = 0;

    render(){
        if(!this.article) return null;
        console.log(this.antLikes);
        return(
            <div className="container pb-xl-5">
                <Container textAlign="center">
                    <h1>{this.article.overskrift}</h1>
                    <i>{this.article.ingress}</i>
                    <Divider hidden />
                    <img width="100%" height="auto" src={this.article.bilde} alt={this.article.overskrift}/>
                </Container>
                <Container textAlign="justified">
                    <i>Lagt inn: {this.article.tid}</i>
                    <br/>
                    <i> Skrevet av: {this.article.forfatter}</i>
                    <Divider />
                    <div>
                        {(this.article.innhold != null) &&
                            this.article.innhold.split("\n").map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))
                        }
                        <Divider hidden />
                    </div>
                    <div>
                        <Button as='div' labelPosition='right' floated='left'>
                            <Button color='red' onClick={this.like}>
                                Like
                            </Button>
                            <Label basic color='red' pointing='left'>
                                <p>{this.antLikes}</p>
                            </Label>
                        </Button>
                        <Button.Group floated='right'>
                            <Button color='orange'onClick={() => {history.push('/nyheter/' + this.article.kategori + '/' + this.article.artikkel_id + '/edit')}}>Endre</Button>
                            <Button.Or />
                            <Button negative onClick={this.delete}>Slett</Button>
                        </Button.Group>
                    </div>
                </Container>

            </div>
        );
    }
    like(){
        console.log("ANTALL LIKES ", this.antLikes);
        articleService
            .addLikes(this.props.match.params.id, this.antLikes)
            .then(() => {
                this.antLikes++;
            })
            .catch((error: Error) => Alert.danger(error.message));
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

        articleService
            .getLikes(this.props.match.params.id)
            .then(likes => {(this.antLikes = likes.length > 0 ? likes[0].antall : 0)})
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

    importance = [{key: 1, text: 'Forside', value: 1}, {key: 2, text: 'Newsfeed', value: 2}];

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
                <Form.Select label='Hvor skal den vises?'
                             options={this.importance}
                             placeholder='Hvor viktig?'
                             name='viktighet'
                             onChange={(event: SyntheticInputEvent<HTMLInputElement>, data: Object) => {this.state.viktighet = data.value}}/>
                <Form.Input label="Overskrift" placeholder="Overskrift" name='overskrift' onChange={this.handleChange}/>
                <Form.TextArea label='Bilde' placeholder='Link til bilde...' name='bilde' onChange={this.handleChange} />
                <Form.TextArea label="Ingress" placeholder='Kort om hva artikkelen handler om...' name='ingress' onChange={this.handleChange}/>
                <Form.TextArea label="Innhold" placeholder='Innhold...'
                               name='innhold'
                               onChange={this.handleChange}
                               required/>
                <Container textAlign='center'>
                    <Button.Group>
                        <Button onClick={() => {history.push('/nyheter')}}>Cancel</Button>
                        <Button.Or />
                        <Button positive onClick={this.save}>Save</Button>
                    </Button.Group>
                </Container>
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
    options2 = [{key: 1, text: 'Forside', value: 1}, {key: 2, text: 'Newsfeed', value: 2}];
    current: string = '';

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
                    <Form.Select label='Hvor skal den vises?'
                                 options={this.options2}
                                 value={this.article.viktighet}
                                 name='viktighet'
                                 onChange={(event: SyntheticInputEvent<HTMLInputElement>, data: Object) => {this.article.viktighet = data.value}}/>

                    <Form.Input label="Overskrift" value={this.article.overskrift} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.article.overskrift = event.target.value}/>
                    <Form.TextArea value={this.article.bilde} label='Bilde' input={this.article.bilde} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.article.bilde = event.target.value} />
                    <Form.TextArea label="Ingress" value={this.article.ingress} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.article.ingress = event.target.value}/>
                    <Form.TextArea label="Innhold" value={this.article.innhold} onChange={(event: SyntheticInputEvent<HTMLInputElement>) => this.article.innhold = event.target.value}/>
                    <Container textAlign='center'>
                        <Button.Group>
                            <Button onClick={() => {history.push('/nyheter')}}>Cancel</Button>
                            <Button.Or />
                            <Button positive onClick={this.save}>Save</Button>
                        </Button.Group>
                    </Container>
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

class Footer extends Component{
    render(){
        return(
            <div className='myFooter'>
                <img src='logo.png' alt='Logo'/>
            </div>
        );
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
        <Footer/>
      </div>
    </HashRouter>,
    root
  );
