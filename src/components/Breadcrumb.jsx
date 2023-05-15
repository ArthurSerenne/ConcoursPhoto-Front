import { Link, useLocation } from 'react-router-dom';

function Breadcrumb({contest}) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav>
      <ul className="flex space-x-2">
        <li>
          <Link to="/">Accueil  {">"}</Link>
        </li>
        {pathnames.map((pathname, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('>')}`;
          const label = pathname.charAt(0).toUpperCase() + pathname.slice(1);
          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <li key={routeTo}>{contest.name}</li>
          ) : (
            <li key={routeTo}>
              <Link to={routeTo}>{label}</Link>
              <span className="mx-2">{'>'}</span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Breadcrumb;