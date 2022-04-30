import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "../Icon/Icon";

import stylesheet from "./ZoomScale.scss";

const MIN = "MIN";
const MAX = "MAX";

class ZoomScale extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limitReached: MIN
    };
  }

  onChange(event) {
    const value = Number(event.target.value).toFixed(2);
    const minValue = Number(this.props.min).toFixed(2);
    const maxValue = Number(this.props.max).toFixed(2);
    let limitReached = false;

    if (value === minValue) limitReached = MIN;
    if (value === maxValue) limitReached = MAX;

    this.setState({ limitReached });

    this.props.onChange.call(this, event);
  }

  render() {
    const zoomMinCssClasses = [stylesheet["zoom-scale__min"], stylesheet["zoom-scale__icon"]];
    const zoomMaxCssClasses = [stylesheet["zoom-scale__max"], stylesheet["zoom-scale__icon"]];

    if (this.state.limitReached === MIN)
      zoomMinCssClasses.push(stylesheet["zoom-scale__icon--disabled"]);

    if (this.state.limitReached === MAX)
      zoomMaxCssClasses.push(stylesheet["zoom-scale__icon--disabled"]);

    return (
      <div className={"_1MKAF96uXJHSW-a1nWoriQ"}>
        <Icon
          name="picture"
          size={17}
          className={"Icon Icon--picture _23VzqtDiBsdmyddgDcP2FF  _3L1oDMFmgTzTs8MCYm-pXt"}
        />
        <input
          type="range"
          className={"kWobJZ5IBLVJtFBD9JHAQ"}
          max={Number(this.props.max).toFixed(2)}
          min={Number(this.props.min).toFixed(2)}
          step={Number(this.props.step).toFixed(2)}
          value={Number(this.props.value).toFixed(2)}
          onChange={this.onChange.bind(this)}
        />
        <Icon
          name="picture"
          size={20}
          className={"Icon Icon--picture _2JJI18xT4B0iIKyuZLMpk9 "}
        />
      </div>
    );
  }
}

ZoomScale.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func
};

ZoomScale.defaultProps = {
  min: 0,
  max: 1,
  step: 0.01,
  value: 0.5,
  onChange: () => {}
};

export default ZoomScale;
