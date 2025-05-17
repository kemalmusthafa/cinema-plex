export interface MovieAccountStates {
  id: number;
  favorite: boolean;
  watchlist: boolean;
  rated?: {
    value: number;
  };
}