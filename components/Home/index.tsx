import React, { Component } from 'react';
import ClassNames from 'classnames/bind';
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import styles from './index.scss';

const cx = ClassNames.bind(styles);

interface Props {}
@observer
export default class Index extends Component<Props> {
  render() {
    return (
      <div className={cx('background')}>
        <h1 className={cx('title')}>Dekina Inc.</h1>
        <h2 className={cx('description')}>세상을 더욱 가치있게</h2>
        <a href="mailto:contact@dekina.com" className={cx('contact')}>
          CONTACT
        </a>
      </div>
    );
  }
}
