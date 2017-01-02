import _ from 'lodash';
import React, { PropTypes, Component } from 'react';
import Highcharts from 'highcharts/highstock';

class Chart extends Component {
  constructor(props) {
    super(props);
    this.chart = undefined;
  }

  // When the DOM is ready, create the chart.
  componentDidMount() {
    // Extend Highcharts with modules
    if (this.props.modules) {
      this.props.modules.forEach(module => {
        module(Highcharts);
      });
    }
    Highcharts.setOptions({
      global: {
        useUTC: false
      }
    });
    this.chart = new Highcharts[this.props.type || 'Chart'](
      this.props.container,
      this.props.options
    );
  }

  shouldComponentUpdate(nextProps) {
    // Only update if our data changed
    const oldData = _.get(this.props.options, 'series[0].data', [[1]]);
    const newData = _.get(nextProps.options, 'series[0].data', [[1]]);
    if (newData[newData.length - 1][0] !== oldData[oldData.length - 1][0]) {
      console.log(newData[newData.length - 1][0]);
      console.log(oldData[oldData.length - 1][0]);
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Highcharts[this.props.type || 'Chart'](
      this.props.container,
      this.props.options
    );
  }

  // Destroy chart before unmount.
  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  // Create the div which the chart will be rendered to.
  render() {
    return (<div id={this.props.container} />);
  }
}

Chart.propTypes = {
  container: PropTypes.string,
  type: PropTypes.string,
  options: PropTypes.shape({
    series: PropTypes.array
  }),
  modules: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Chart;
