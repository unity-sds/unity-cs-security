import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux"; // redux
import { editCustomFilterId } from "../../redux/actions";
import { ReactiveComponent } from "@appbaseio/reactivesearch"; // reactivesearch

let Handler = class extends React.Component {
  constructor(props) {
    super(props);

    const { componentId } = props;
    this.state = {
      [componentId]: props[componentId],
    };
  }

  componentDidMount() {
    const { value, dataField } = this.props;

    if (value) {
      const query = this.generateQuery(dataField, value);
      this.props.setQuery({
        query,
        value,
      });
    }
  }

  generateQuery = (dataField, value) => ({
    query: {
      term: {
        [dataField]: value,
      },
    },
  });

  sendEmptyQuery = () => {
    const { componentId } = this.props;
    this.props.setQuery({
      query: null,
      value: null,
    });
    this.setState({
      [componentId]: null,
    });
  };

  componentDidUpdate() {
    const { dataField, componentId } = this.props;

    if (this.props[componentId] !== this.state[componentId]) {
      if (this.props[componentId]) {
        const query = this.generateQuery(dataField, this.props[componentId]);
        this.props.setQuery({
          query,
          value: this.props[componentId],
        });
        this.setState({
          [componentId]: this.props[componentId],
        });
      } else {
        this.sendEmptyQuery(); // clearing custom field facet
      }
    } else if (this.props[componentId] !== this.props.value) {
      // this is to handle page forwards and backwards
      if (this.props.value) {
        const query = this.generateQuery(dataField, this.props.value);
        this.props.setQuery({
          query,
          value: this.props.value,
        });
      } else {
        this.sendEmptyQuery();
      }
      this.props.editCustomFilterId(componentId, this.props.value);
      this.setState({
        [componentId]: this.props.value,
      });
    }
  }

  render = () => <></>;
};

// Redux states and actions
const mapStateToProps = (state, ownProps) => {
  const { componentId } = ownProps;
  return {
    [componentId]: state.reactivesearchReducer[componentId],
  };
};

const mapDispatchToProps = (dispatch) => ({
  editCustomFilterId: (componentId, value) =>
    dispatch(editCustomFilterId(componentId, value)),
});

Handler = connect(mapStateToProps, mapDispatchToProps)(Handler);

function CustomIdFilter({ componentId, dataField }) {
  return (
    <ReactiveComponent
      componentId={componentId}
      URLParams={true}
      render={({ setQuery, value }) => (
        <Handler
          setQuery={setQuery}
          value={value}
          componentId={componentId}
          dataField={dataField}
        />
      )}
    />
  );
}

CustomIdFilter.propTypes = {
  componentId: PropTypes.string.isRequired,
  dataField: PropTypes.string.isRequired,
};

export default CustomIdFilter;
