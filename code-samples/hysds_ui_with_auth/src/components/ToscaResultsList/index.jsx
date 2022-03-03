import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux"; // redux
import { clickDatasetId, retrieveData } from "../../redux/actions";

import { ReactiveList } from "@appbaseio/reactivesearch"; // reactivesearch
import ToscaDataViewer from "../ToscaDataViewer";
import DataTable from "../DataTable";

import {
  ToggleSlider,
  SortOptions,
  SortDirection,
  PageSizeOptions,
} from "../../components/TableOptions";
import { SORT_OPTIONS, FIELDS } from "../../config/tosca";

import "./style.css";

const TABLE_VIEW_STORE = "table-view-tosca";
const PAGE_SIZE_STORE = "page-size-tosca";
const SORT_FIELD_STORE = "sort-field-tosca";
const SORT_DIRECTION_STORE = "sort-direction-tosca";

class ResultsList extends React.Component {
  constructor(props) {
    super(props);

    const pageSize = localStorage.getItem(PAGE_SIZE_STORE);
    const tableView = localStorage.getItem(TABLE_VIEW_STORE);

    this.state = {
      tableView: tableView === "true" ? true : false,
      pageSize: pageSize ? parseInt(pageSize) : props.pageSize,
      sortColumn: localStorage.getItem(SORT_FIELD_STORE) || "@timestamp",
      sortOrder: localStorage.getItem(SORT_DIRECTION_STORE) || "desc",
    };
  }

  // callback function to handle the results from ES
  resultsListHandler = (res) => (
    <div key={`${res._index}-${res._id}`}>
      <ToscaDataViewer
        res={res}
        darkMode={this.props.darkMode}
        clickDatasetId={this.props.clickDatasetId}
      />
    </div>
  );

  handleTableToggle = () => {
    this.setState({ tableView: !this.state.tableView });
    localStorage.setItem(TABLE_VIEW_STORE, !this.state.tableView);
  };

  handlePageSize = (e) => {
    this.setState({ pageSize: parseInt(e.target.value) });
    localStorage.setItem(PAGE_SIZE_STORE, e.target.value);
  };

  handleSortColumn = (e) => {
    this.setState({ sortColumn: e.target.value });
    localStorage.setItem(SORT_FIELD_STORE, e.target.value);
  };

  handleSortDirection = (e) => {
    this.setState({ sortOrder: e.target.value });
    localStorage.setItem(SORT_DIRECTION_STORE, e.target.value);
  };

  renderTable = ({ data, loading }) => {
    const { sortColumn, sortOrder } = this.state;

    return data.length > 0 ? (
      <DataTable
        data={data}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        theme={this.props.theme}
      />
    ) : null;
  };

  render() {
    const { componentId, queryParams } = this.props;
    const { pageSize, tableView, sortColumn, sortOrder } = this.state;

    const sortOptions =
      sortColumn !== "None"
        ? [
            {
              label: sortColumn,
              dataField: sortColumn,
              sortBy: sortOrder,
            },
          ]
        : null;

    return (
      <div>
        <div className="results-display-options">
          <ToggleSlider
            label="Table View: "
            value={tableView}
            onChange={this.handleTableToggle}
            checked={tableView}
          />

          <div className="results-display-buffer" />
          <SortOptions
            label="Sort By: "
            value={sortColumn}
            onChange={this.handleSortColumn}
            options={SORT_OPTIONS}
          />
          <SortDirection
            value={sortOrder}
            onChange={this.handleSortDirection}
          />
          <PageSizeOptions
            label="Page Size: "
            value={pageSize}
            onChange={this.handlePageSize}
          />
        </div>

        <ReactiveList
          componentId={componentId}
          className="reactivesearch-results-list"
          dataField="tosca_reactive_list"
          size={pageSize}
          pages={7}
          stream={true}
          pagination={true}
          scrollOnChange={false}
          paginationAt="both"
          onData={this.props.retrieveData}
          react={queryParams}
          renderResultStats={(stats) => (
            <h3 className="tosca-result-stats">{`${stats.numberOfResults} results`}</h3>
          )}
          renderItem={tableView ? null : this.resultsListHandler}
          render={tableView ? this.renderTable : null}
          sortOptions={sortOptions}
          includeFields={FIELDS ? FIELDS : null}
        />
      </div>
    );
  }
}

ResultsList.propTypes = {
  componentId: PropTypes.string.isRequired,
  queryParams: PropTypes.object.isRequired,
};

ResultsList.defaultProps = {
  pageSize: 10,
};

const mapStateToProps = (state) => ({
  darkMode: state.themeReducer.darkMode,
});

const mapDispatchToProps = (dispatch) => ({
  clickDatasetId: (_id) => dispatch(clickDatasetId(_id)),
  retrieveData: (data) => dispatch(retrieveData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultsList);
