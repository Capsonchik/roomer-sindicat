import {Link, useRouteError} from "react-router-dom";
import './App.css'

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className='error-page'>
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <Link to={'/'}>Go to main page</Link>
      </div>
    </div>

  );
}