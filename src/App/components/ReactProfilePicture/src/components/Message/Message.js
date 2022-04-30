import React, { Component } from "react";
import PropTypes from "prop-types";
import style from "./Message.scss";

class Message extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={"YpD9o6H9LydyYmaPWOwt"}>
        {this.props.onClick ? (
          <button className={"eXEoGG26iwSi6UiZD8FI6"} onClick={this.props.onClick}>
            <div className={"_6IMSWtd3wtGGn2KgOcZIK"}>{this.props.children}</div>
          </button>
        ) : (
          <div className={style["message__content"]}>{this.props.children}</div>
        )}
      </div>
    );
  }
}

Message.propTypes = {
  onClick: PropTypes.func
};

export default Message;
