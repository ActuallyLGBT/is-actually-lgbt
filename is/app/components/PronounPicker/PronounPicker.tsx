import React from 'react';

const styles = require('./PronounPicker.css');

class PronounPicker extends React.Component {
  render() {
    return (
      <span className={styles.pronounPicker}>
        <div className={styles.pronounSelector}>
          <select name="possesive">
            <option value="his">His</option>
            <option value="her">Her</option>
            <option value="their">Their</option>
            <option value="xer">Xir</option>
          </select>
        </div>{' '}
        pronouns are
        <br />
        <span className={styles.pronouns}>
          <div className={styles.pronounSelector}>
            <select name="subject">
              <option value="his">He</option>
              <option value="her">She</option>
              <option value="their">They</option>
              <option value="xer">Xe</option>
            </select>
          </div>{' '}
          /{' '}
          <div className={styles.pronounSelector}>
            <select name="object">
              <option value="his">Him</option>
              <option value="her">Her</option>
              <option value="their">Them</option>
              <option value="xer">Xem</option>
            </select>
          </div>
        </span>
      </span>
    );
  }
}

export default PronounPicker;
