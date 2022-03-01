import React from "react";
import { ReactiveComponent } from "@appbaseio/reactivesearch"; // reactivesearch

import "./style.css";

// wrapper component for ReactiveComponent
function SearchQuery({ componentId, theme }) {
  return (
    <ReactiveComponent
      componentId={componentId}
      URLParams={true}
      render={({ setQuery, value }) => (
        <SearchQueryHandler setQuery={setQuery} value={value} theme={theme} />
      )}
    />
  );
}

SearchQuery.defaultProps = {
  theme: "__theme-light",
};

// main component for the search query
class SearchQueryHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userTyping: false,
      value: props.value,
    };
  }

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      const query = this.generateQuery(value);
      this.props.setQuery({ query, value });
    }
  }

  componentDidUpdate() {
    const { userTyping } = this.state;

    if (userTyping) return;

    if (this.props.value !== this.state.value) {
      if (this.props.value !== null) {
        const query = this.generateQuery(this.props.value);
        this.props.setQuery({
          query,
          value: this.props.value,
        });
      } else {
        this.sendEmptyQuery();
      }
      this.setState({ value: this.props.value }); // prevent maximum recursion error
    }
  }

  generateQuery = (searchQuery) => ({
    query: {
      query_string: {
        query: searchQuery,
        default_operator: "OR",
      },
    },
  });

  sendEmptyQuery = () => {
    this.props.setQuery({ query: null, value: null });
    this.setState({ value: null, userTyping: false });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { value } = this.state;

    if (!value) this.sendEmptyQuery();
    else {
      const query = this.generateQuery(value);
      this.props.setQuery({ query, value }); // sending query to elasticsearch
      this.setState({
        value,
        userTyping: false,
      });
    }
  };

  handleChange = (e) => {
    const queryString = e.target.value;
    this.setState({
      userTyping: true,
      value: queryString,
    });
  };

  render() {
    const { value } = this.state;

    return (
      <>
        <form
          className={`${this.props.theme} query-input-form`}
          onSubmit={this.handleSubmit}
        >
          <input
            className="query-input-box"
            type="text"
            value={value || ""}
            onChange={this.handleChange}
            placeholder={`Input Elasticsearch query string... ex. _id:"test_id"`}
          />
        </form>
      </>
    );
  }
}

export default SearchQuery;
