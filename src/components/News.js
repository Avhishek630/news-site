import React, { Component } from "react";
import NewsItem from "./NewsItem";
import PropTypes from 'prop-types';

export class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: 6,
    category: 'general',
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  }

  article = [];

  constructor() {
    super();
    console.log("hello i am constructor from News component");
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
    };
  }

  async componentDidMount() {
    console.log("cdn");
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=a860fc686d6e4023af515fb154a7da14&page=1&pagesize=${this.props.pageSize}`;
    try {
      let data = await fetch(url);
      let parsedData = await data.json();
      console.log(parsedData);
      this.setState({
        articles: parsedData.articles,
        totalResults: parsedData.totalResults,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching news:", error);
      this.setState({ loading: false });
    }
  }

  handlePreviousClick = async () => {
    console.log("previous");
    var url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=a860fc686d6e4023af515fb154a7da14&page=${this.state.page - 1}&pagesize=${this.props.pageSize}`;
    try {
      var data = await fetch(url);
      var parsedData = await data.json();
      console.log(parsedData);
      this.setState({ articles: parsedData.articles, loading: false });
    } catch (error) {
      console.error("Error fetching news:", error);
      this.setState({ loading: false });
    }

    this.setState({
      page: this.state.page - 1,
    });
  };

  handleNextClick = async () => {
    console.log("next");
    if (this.state.page + 1 > Math.ceil(this.state.totalResults / 6)) {
      // Handle the case where there are no more pages
    } else {
      var url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=a860fc686d6e4023af515fb154a7da14&page=${this.state.page + 1}&pagesize=${this.props.pageSize}`;
      try {
        var data = await fetch(url);
        var parsedData = await data.json();
        console.log(parsedData);
        this.setState({ articles: parsedData.articles, loading: false });
      } catch (error) {
        console.error("Error fetching news:", error);
        this.setState({ loading: false });
      }

      this.setState({
        page: this.state.page + 1,
      });
    }
  };

  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center">News Monkey - Top headlines</h1>

        <div className="row">
          {this.state.articles.map((element) => (
            <div className="col-md-4" key={element.url}>
              <NewsItem
                title={element.title ? element.title.slice(0, 45) : ""}
                description={element.description ? element.description.slice(0, 85) : ""}
                imageUrl={element.urlToImage}
                newsUrl={element.url}
              />
            </div>
          ))}
        </div>
        <div className="container d-flex justify-content-between">
          <button
            type="button"
            disabled={this.state.page <= 1}
            className="btn btn-dark"
            onClick={this.handlePreviousClick}
          >
            &larr; Previous
          </button>
          <button
            type="button"
            disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)}
            className="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
