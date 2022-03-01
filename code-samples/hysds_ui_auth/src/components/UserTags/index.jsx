import React, { useState } from "react";
import PropTypes from "prop-types";
import { css } from "emotion";

import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Tag(props) {
  const style = css`
    padding: 3px 7px;
    background-color: #dcdcdc;
    margin: 1px 3px;
    font-size: 13px;
    &:hover {
      color: #dc3645;
    }
  `;

  const deleteStyle = css`
    padding-right: 6px;
    border-right: 1px solid #fff;
  `;

  const tagStyle = css`
    padding-left: 5px;
  `;

  const handleClick = () => props.onDelete(props.value);

  return (
    <div onClick={handleClick} className={style}>
      <span className={deleteStyle}>
        <FontAwesomeIcon icon={faTimes} />
      </span>
      <span className={tagStyle}>{props.value}</span>
    </div>
  );
}

Tag.propTypes = {
  value: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

function Input(props) {
  const { value } = props;

  const style = css`
    flex-grow: 1;
    border: none;
    font-size: 13px;
  `;

  const keyInput = (e) => {
    switch (e.key) {
      case "Enter":
      case "Tab":
        if (value.trim() === "") return;
        props.onAdd(value);
        props.setValue("");
        return;
      case "Backspace":
        if (e.target.value === "") props.onDelete();
        else return;
    }
  };

  return (
    <input
      placeholder={props.placeholder}
      type="text"
      value={value}
      onKeyDown={keyInput}
      onChange={(e) => props.setValue(e.target.value)}
      className={style}
    />
  );
}

Input.propTypes = {
  value: PropTypes.string.isRequired,
};

const UserTags = (props) => {
  let { tags, index, id, endpoint } = props;

  const [userTags, setTags] = useState(tags || []);
  const [value, setValue] = useState("");

  const onAdd = (tag) => {
    if (userTags.indexOf(tag) === -1) {
      const data = { index, id, tag: tag };
      const body = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };

      fetch(endpoint, body).then(() => setTags([...userTags, tag]));
    }
  };

  const deleteAPI = (tag) => {
    const params = new URLSearchParams({ id, index, tag });
    const url = `${endpoint}?${params}`;
    return fetch(url, { method: "DELETE" });
  };

  const onDelete = () => {
    if (userTags.length === 0) return;
    const lastTag = userTags[userTags.length - 1];

    deleteAPI(lastTag).then(() =>
      setTags(userTags.slice(0, userTags.length - 1))
    );
  };
  const onDeleteClick = (tag) => {
    const idx = userTags.indexOf(tag);
    deleteAPI(tag).then(() =>
      setTags([...userTags.slice(0, idx), ...userTags.slice(idx + 1)])
    );
  };

  const style = css`
    display: flex;
    flex-wrap: wrap;
    border: 1px solid black;
    border-radius: 5px;
    border-color: #9b9b9b;
    background-color: #fff;
    color: black;
    padding: 5px;
    margin: 5px 0px 2px 0px;
  `;

  return (
    <div className={style}>
      {userTags.map((tag) => (
        <Tag onDelete={onDeleteClick} key={tag} value={tag} />
      ))}
      <Input
        value={value}
        onAdd={onAdd}
        onDelete={onDelete}
        setTags={setTags}
        setValue={setValue}
        placeholder="User Tags..."
      />
    </div>
  );
};

UserTags.propTypes = {
  tags: PropTypes.array.isRequired,
  endpoint: PropTypes.string.isRequired,
  index: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default UserTags;
