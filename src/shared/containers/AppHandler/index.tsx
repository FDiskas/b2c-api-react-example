import * as React from 'react';
import { ToastContainer, Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {IComponent} from "../../../typings/app";

import {getContentRoutes} from '../../routes/contentRoutes';


const styles = require('./style.scss');
console.info('primary', styles.primary); // -> #BF4040
console.info('secondary', styles.secondary); // -> #1F4F7F
const className = styles.appHandler;

export const AppHandler = function (props: IComponent) {
  return (
    <div className={className}>
      {getContentRoutes()}
      <ToastContainer
        autoClose={5000}
        transition={Slide}
        position={toast.POSITION.BOTTOM_LEFT}
      />
    </div>
  );
};
