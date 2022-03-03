import React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { ReactiveBase, SelectedFilters } from "@appbaseio/reactivesearch";

import JobCountsBanner from "../../components/JobCountsBanner";
import SidebarFilters from "../../components/SidebarFilters";
import SearchQuery from "../../components/SearchQuery";
import CustomIdFilter from "../../components/CustomIdFilter";
import FigaroResultsList from "../../components/FigaroResultsList";
import { HelperLink } from "../../components/miscellaneous";
import { ButtonLink, ScrollTop } from "../../components/Buttons";

import { setQuery, editCustomFilterId } from "../../redux/actions";
import { getJobCounts } from "../../redux/actions/figaro";

import HeaderBar, {
  HeaderLink,
  DropdownSources,
} from "../../components/HeaderBar";
import { LastUpdatedAtBanner } from "../../components/miscellaneous";

import { LOCAL_DEV, MOZART_ES_URL, MOZART_ES_INDICES } from "../../config";
import { FILTERS, QUERY_LOGIC } from "../../config/figaro";

import "./style.css";

class Figaro extends React.Component {
  constructor(props) {
    super(props);
    this.pageRef = React.createRef();

    this.mozart_es_url = LOCAL_DEV
      ? MOZART_ES_URL
      : `${window.origin}/${MOZART_ES_URL}`;

    this.state = {
      lastUpdatedAt: null,
    };
  }

  componentDidMount() {
    this.props.getJobCounts();
  }

  handleTransformRequest = (e) => {
    let d = new Date();
    this.setState({
      lastUpdatedAt: `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`,
    });

    const body = e.body.split("\n");
    let [preference, query] = body;
    query = JSON.parse(query);

    let parsedQuery = query.query;
    parsedQuery = JSON.stringify(parsedQuery);
    this.props.setQuery(parsedQuery);
    return e;
  };

  render() {
    const { darkMode, query, dataCount } = this.props;
    const classTheme = darkMode ? "__theme-dark" : "__theme-light";

    return (
      <>
        <Helmet>
          <title>Figaro - Home</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
        <HeaderBar title="HySDS" theme={classTheme}>
          <HeaderLink href="/tosca" title="Tosca" active={0} />
          <HeaderLink href="/figaro" title="Figaro" active={1} />
          <DropdownSources />
        </HeaderBar>

        <ReactiveBase
          url={this.mozart_es_url}
          app={MOZART_ES_INDICES}
          transformRequest={this.handleTransformRequest}
        >
          <div className="figaro-page-wrapper">
            <div className={`${classTheme} figaro-sidenav`}>
              <div className="sidenav-title">Filters</div>
              <SidebarFilters filters={FILTERS} queryLogic={QUERY_LOGIC} />
            </div>

            <div className="figaro-body" ref={this.pageRef}>
              <LastUpdatedAtBanner time={this.state.lastUpdatedAt} />
              <JobCountsBanner updateCount={this.props.getJobCounts} />

              <div className="top-bar-wrapper">
                <HelperLink link="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html" />
                <SearchQuery componentId="query_string" theme={classTheme} />

                <div className="button-wrapper">
                  <div className="figaro-button">
                    <ButtonLink
                      label="On Demand"
                      target="on-demand-figaro"
                      size="small"
                      color="success"
                      href={`/figaro/on-demand?query=${query}&total=${dataCount}`}
                    />
                  </div>
                  <div className="figaro-button">
                    <ButtonLink
                      label="Create Rule"
                      target="figaro-user-rules"
                      size="small"
                      href={`figaro/user-rule?query=${query}`}
                    />
                  </div>
                  <div className="figaro-button">
                    <ButtonLink
                      label="View Rules"
                      target="figaro-user-rules"
                      size="small"
                      href={"figaro/user-rules"}
                    />
                  </div>
                </div>
              </div>

              <div className="filter-list-wrapper">
                <SelectedFilters className="filter-list" />
                <CustomIdFilter
                  componentId="payload_id"
                  dataField="payload_id"
                />
                <CustomIdFilter componentId="_id" dataField="_id" />
              </div>

              <FigaroResultsList />
            </div>
            <ScrollTop onClick={() => this.pageRef.current.scrollTo(0, 0)} />
          </div>
        </ReactiveBase>
      </>
    );
  }
}

Figaro.defaultProps = {
  theme: "__theme-light",
};

const mapStateToProps = (state) => ({
  darkMode: state.themeReducer.darkMode,
  query: state.generalReducer.query,
  dataCount: state.generalReducer.dataCount,
});

const mapDispatchToProps = (dispatch) => ({
  setQuery: (query) => dispatch(setQuery(query)),
  getJobCounts: () => dispatch(getJobCounts()),
  editCustomFilterId: (componentId, value) =>
    dispatch(editCustomFilterId(componentId, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Figaro);
