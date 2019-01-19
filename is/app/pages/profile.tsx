import React from "react";
import Head from "next/head";

const styles = require("./styles/profile.css");

export interface ProfileProps {
  userName: string;
}

class Profile extends React.Component<ProfileProps, {}> {
  static getInitialProps({ query: { userName } }) {
    return { userName };
  }

  render() {
    return (
      <div className={styles.body}>
        <Head>
          <link rel="stylesheet" href="https://use.typekit.net/ioo3nhf.css" />
        </Head>
        <h1>{this.props.userName} is actually LGBTQQIA.</h1>
      </div>
    );
  }
}

export default Profile;
