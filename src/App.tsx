import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import { NotificationsList } from './features/notifications/NotificationsList';
import { UsersList } from './features/users/UsersList';
import { UserPage } from './features/users/UserPage';
import { AddPostForm } from './features/posts/AddPostForm';
import { PostsList } from './features/posts/PostsList';
import { EditPostForm } from './features/posts/EditPostForm';
import { Navbar } from './app/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app">
        <Switch>
          <Route exact path="/" render={() => (
            <>
              <AddPostForm />
              <PostsList />
            </>
          )}/>
          <Route exact path="/notifications" component={NotificationsList} />
          <Route exact path="/posts" component={PostsList} />
          <Route exact path="/posts/:postId" component={EditPostForm} />
          <Route exact path="/users" component={UsersList} />
          <Route exact path ="/users/:userId" component={UserPage}/>
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
