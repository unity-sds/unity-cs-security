import React from "react";
import { Helmet } from "react-helmet";
import { ReactiveBase, SelectedFilters } from "@appbaseio/reactivesearch";
import { connect } from "react-redux";
import { setQuery } from "../../redux/actions";

// custom components we built to handle elasticsearch data
import ToscaResultsList from "../../components/ToscaResultsList";
import ReactiveMap from "../../components/ReactiveMap";
import IdQueryHandler from "../../components/IdQueryHandler";
import SearchQuery from "../../components/SearchQuery";

// custom utility components
import { ButtonLink, ScrollTop } from "../../components/Buttons";

import SidebarFilters from "../../components/SidebarFilters";
import { HelperLink } from "../../components/miscellaneous";
import HeaderBar, {
  HeaderLink,
  DropdownSources,
} from "../../components/HeaderBar";
import { LastUpdatedAtBanner } from "../../components/miscellaneous";

import { LOCAL_DEV, GRQ_ES_URL, GRQ_ES_INDICES } from "../../config";
import {
  GRQ_TABLE_VIEW_DEFAULT,
  ID_COMPONENT, // all fields read by Reactivesearch
  MAP_COMPONENT_ID,
  QUERY_SEARCH_COMPONENT_ID,
  RESULTS_LIST_COMPONENT_ID,
  DISPLAY_MAP, // display map or do not render
  FILTERS,
  QUERY_LOGIC,
} from "../../config/tosca";

import "./style.css";

class Tosca extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableView: GRQ_TABLE_VIEW_DEFAULT, // boolean
      lastUpdatedAt: null,
    };

    this.grq_es_url = LOCAL_DEV ? GRQ_ES_URL : `${window.origin}/${GRQ_ES_URL}`;

    this.mapRef = React.createRef();
    this.pageRef = React.createRef();
  }

  componentDidUpdate() {
    // scrolls to top of page if the query region button is pressed
    if (this.props.queryRegion)
      this.mapRef.current.scrollIntoView({ block: "start" });
  }

  handleTransformRequest = (e) => {
    let d = new Date();
    this.setState({
      lastUpdatedAt: `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`,
    });

    const body = e.body.split("\n");
    let [preference, query] = body;
    query = JSON.parse(query);

    // main query ran to get the data
    let parsedQuery = query.query;
    parsedQuery = JSON.stringify(parsedQuery);
    this.props.setQuery(parsedQuery);
    return e;
  };

  render() {
    const { darkMode, data, dataCount, query } = this.props;
    const classTheme = darkMode ? "__theme-dark" : "__theme-light";

    const reactiveMap = DISPLAY_MAP ? (
      <ReactiveMap
        componentId={MAP_COMPONENT_ID}
        zoom={5}
        maxZoom={10}
        minZoom={2}
        data={data}
      />
    ) : null;

    return (
      <>
        <Helmet>
          <title>Tosca - Home</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
        <HeaderBar title="HySDS" theme={classTheme}>
          <HeaderLink href="/tosca" title="Tosca" active={1} />
          <HeaderLink href="/figaro" title="Figaro" active={0} />
          <DropdownSources />
        </HeaderBar>

        <ReactiveBase
          url={this.grq_es_url}
          app={GRQ_ES_INDICES}
          transformRequest={this.handleTransformRequest}
        >
          <div className="tosca-page-wrapper">
            <div className={`${classTheme} tosca-sidenav`}>
              <div className="sidenav-title">Filters</div>
              <SidebarFilters filters={FILTERS} queryLogic={QUERY_LOGIC} />
            </div>

            <div className="tosca-body" ref={this.pageRef}>
              <LastUpdatedAtBanner time={this.state.lastUpdatedAt} />
              <div className="top-bar-wrapper">
                <HelperLink link="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html" />
                <SearchQuery
                  componentId={QUERY_SEARCH_COMPONENT_ID}
                  theme={classTheme}
                />
                <IdQueryHandler componentId={ID_COMPONENT} />
                <div className="button-wrapper">
                  <div className="tosca-button">
                    <ButtonLink
                      label="On Demand"
                      target="on-demand-tosca"
                      size="small"
                      color="success"
                      href={`/tosca/on-demand?query=${query}&total=${dataCount}`}
                    />
                  </div>
                  <div className="tosca-button">
                    <ButtonLink
                      label="Create Rule"
                      target="tosca-user-rules"
                      size="small"
                      href={`tosca/user-rule?query=${query}`}
                    />
                  </div>
                  <div className="tosca-button">
                    <ButtonLink
                      label="View Rules"
                      target="tosca-user-rules"
                      size="small"
                      href={"tosca/user-rules"}
                    />
                  </div>
                </div>
              </div>

              <div className="filter-list-wrapper">
                <SelectedFilters className="filter-list" />
              </div>
              <div ref={this.mapRef}>{reactiveMap}</div>
              <ToscaResultsList
                componentId={RESULTS_LIST_COMPONENT_ID}
                queryParams={QUERY_LOGIC}
                pageSize={10}
                theme={classTheme}
              />
            </div>
            <ScrollTop onClick={() => this.pageRef.current.scrollTo(0, 0)} />
          </div>
        </ReactiveBase>
      </>
    );
  }
}

Tosca.defaultProps = {
  theme: "__theme-light",
};

// redux state data
const mapStateToProps = (state) => ({
  darkMode: state.themeReducer.darkMode,
  data: state.generalReducer.data,
  dataCount: state.generalReducer.dataCount,
  query: state.generalReducer.query,
  queryRegion: state.reactivesearchReducer.queryRegion,
});

const mapDispatchToProps = (dispatch) => ({
  setQuery: (query) => dispatch(setQuery(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Tosca);
