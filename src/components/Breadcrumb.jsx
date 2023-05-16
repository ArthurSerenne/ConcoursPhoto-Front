import { Link, useLocation } from 'react-router-dom';

function Breadcrumb({contest}) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav>
      <div className='md:flex md:space-x-2'>
        <Link to="/" className='flex-none'>Accueil  {">"}</Link>
        {pathnames.map((pathname, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('>')}`;
          const label = pathname.charAt(0).toUpperCase() + pathname.slice(1);
          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <p className='flex-1' key={routeTo}>{contest.name}</p>
          ) : (
            <p key={routeTo} className='flex-initial'>
              <Link to={routeTo}>{label}</Link>
              <span className="mx-2">{'>'}</span>
            </p>
          );
        })}
      </div>
    </nav>
  );
}

export default Breadcrumb;