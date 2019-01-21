import React from 'react';
import Head from 'next/head';
import MarkdownIt from 'markdown-it';
import emoji from 'markdown-it-emoji';
import twemoji from 'twemoji';
import mdSub from 'markdown-it-sub';
import mdSup from 'markdown-it-sup';
import mdFooter from 'markdown-it-footnote';
import hljs from 'highlight.js';
import cn from 'classnames';

const styles = require('./styles/profile.css');
const testMd = require('../test.md');

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

        return ''; // use external default escaping
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
          <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css" />
        </Head>
        <div className={styles.content}>
          <header>
            <h1 className={styles.hero}>
              {/* <span>{this.props.userName}</span> */}
              <span>Lissandra Mordalis</span>
              <span>is actually</span>
              <span className={styles.letters}>
                <span className={cn(styles.letterL, styles.active)}>L</span>
                <span className={styles.letterG}>G</span>
                <span className={styles.letterB}>B</span>
                <span className={cn(styles.letterT, styles.active)}>T</span>
                <span className={cn(styles.letterQr, styles.active)}>Q</span>
                <span className={styles.letterQs}>Q</span>
                <span className={styles.letterI}>I</span>
                <span className={styles.letterA}>A</span>
              </span>
            </h1>
            <span className={styles.pronounLine}>
              Their pronouns are <span className={styles.pronouns}>They/Them</span>
            </span>
            <div className={styles.social}>
              <span>You can find them here:</span>
              <ul className={styles.socialLinks}>
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
                  <i className="fab fa-github" />
                </li>
                <li>
                  <i className="fab fa-youtube" />
                </li>
                <li>
                  <i className="fab fa-tumblr" />
                </li>
                <li>
                  <i className="fab fa-snapchat" />
                </li>
                <li>
                  <i className="fa fa-link" />
                </li>
              </ul>
            </div>
          </header>
          <div dangerouslySetInnerHTML={{ __html: md.render(testMd) }} />
        </div>
      </main>
    );
  }
}

export default Profile;
