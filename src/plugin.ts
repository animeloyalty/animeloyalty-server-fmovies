import * as app from '.';
import {FMovies} from './fmovies/FMovies';

module.exports = <app.IPlugin> {
  get providers() {
    return [FMovies];
  }
};
