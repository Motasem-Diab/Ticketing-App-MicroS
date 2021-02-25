import Link from 'next/link';

export default ({ currentuser }) => {
  const links = [
    !currentuser && { label: 'Sign Up', href: '/auth/signup' },
    !currentuser && { label: 'Sign In', href: '/auth/signin' },
    currentuser && { label: 'Sign Out', href: '/auth/signout' }
  ]
    .filter(linkConfig => linkConfig)       // get one who is not falsy
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
            {/* {currentuser ? 'Sign out' : 'sign in/up'} */}
            {links}
        </ul>
      </div>
    </nav>
  );
};