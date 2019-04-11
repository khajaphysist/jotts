import Link from 'next/link';

import { AppBar, Button, Toolbar } from '@material-ui/core';

const Header = () => (
  <div>
    <AppBar>
      <Toolbar>
        <Link href="/">
          <Button>Home</Button>
        </Link>
        <Link href="/about">
          <Button>About</Button>
        </Link>
      </Toolbar>
    </AppBar>
  </div>
)

export default Header