import React from "react";
import Head from "next/head";
import MarkdownIt from "markdown-it";
import emoji from "markdown-it-emoji";
import twemoji from "twemoji";
import mdSub from "markdown-it-sub";
import mdSup from "markdown-it-sup";
import mdFooter from "markdown-it-footnote";
import hljs from "highlight.js";

const styles = require("./styles/profile.css");
const testMd = require("../test.md");

export interface ProfileProps {
  userName: string;
}

class Profile extends React.Component<ProfileProps, {}> {
  static getInitialProps({ query: { userName } }): ProfileProps {
    return { userName };
  }

  render() {
    const md = MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight(str: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) {}
        }

        return ""; // use external default escaping
      }
    })
      .use(emoji)
      .use(mdSub)
      .use(mdSup)
      .use(mdFooter);

    md.renderer.rules.emoji = (token, idx) => {
      return twemoji.parse(token[idx].content);
    };

    return (
      <main>
        <Head>
          <meta name="viewport" content="width=device-width" />

          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"
            integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/"
            crossOrigin="anonymous"
          />
          <link rel="stylesheet" href="https://use.typekit.net/sqz1orn.css" />
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/styles/default.min.css"
          />
          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css"
          />
        </Head>
        <h1>{this.props.userName} is actually LGBTQQIA.</h1>
        <span>Her pronouns are She/Her</span>
        <div>
          <span>You can find her here:</span>
          <ul>
            <li>
              <i className="fab fa-twitter" />
            </li>
            <li>
              <i className="fab fa-instagram" />
            </li>
            <li>
              <i className="fab fa-twitch" />
            </li>
            <li>
              <i className="fa fa-link" />
            </li>
          </ul>
        </div>
        <div dangerouslySetInnerHTML={{ __html: md.render(testMd) }} />
      </main>
    );
  }
}

export default Profile;
