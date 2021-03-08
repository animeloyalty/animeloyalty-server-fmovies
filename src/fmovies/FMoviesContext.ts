import * as app from '..';

export class FMoviesContext {
  static findPage(page?: string) {
    return this.pages().find(x => x.id === page);
  }

  static pages(): Array<app.api.RemoteProviderPage> {
    return [
      {type: 'oneOf', id: 'views:desc', label: 'Popular', options: []},
      {type: 'oneOf', id: 'post_date:desc', label: 'Updated', options: []},
      {type: 'mixOf', id: 'genres', label: 'Genres', options: this.genres()}
    ];
  }

  private static genres() {
    return [
      {id: '25', label: 'Action'},
      {id: '17', label: 'Adventure'},
      {id: '10', label: 'Animation'},
      {id: '215', label: 'Biography'},
      {id: '1693', label: 'Costume'},
      {id: '14', label: 'Comedy'},
      {id: '26', label: 'Crime'},
      {id: '131', label: 'Documentary'},
      {id: '1', label: 'Drama'},
      {id: '43', label: 'Family'},
      {id: '31', label: 'Fantasy'},
      {id: '212', label: 'Game-Show'},
      {id: '47', label: 'History'},
      {id: '74', label: 'Horror'},
      {id: '248', label: 'Kungfu'},
      {id: '199', label: 'Music'},
      {id: '64', label: 'Mystery'},
      {id: '4', label: 'Reality-TV'},
      {id: '23', label: 'Romance'},
      {id: '15', label: 'Sci-Fi'},
      {id: '44', label: 'Sport'},
      {id: '7', label: 'Thriller'},
      {id: '139', label: 'TV Show'},
      {id: '58', label: 'War'},
      {id: '28', label: 'Western'}
    ];
  }
}
