import React from 'react';
import MarkdownIt from 'markdown-it';
import emoji from 'markdown-it-emoji';
import twemoji from 'twemoji';
import mdSub from 'markdown-it-sub';
import mdSup from 'markdown-it-sup';
import mdFooter from 'markdown-it-footnote';
import hljs from 'highlight.js';
import cn from 'classnames';

import PronounPicker from '../../PronounPicker';

const styles = require('./ProfileEdit.css');
const stdStyles = require('../../ProfilePage/ProfilePage.css');
const testMd = require('../../../test.md');

export interface ProfileEditProps {
  userName: string;
}

class ProfileEdit extends React.Component<ProfileEditProps, {}> {
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
      <form className={styles.profileEdit}>
        <div className={stdStyles.content}>
          <header>
            <h1 className={stdStyles.hero}>
              <input type="text" defaultValue="Lissandra Mordalis" />
              <span>is actually</span>
              <div className={styles.letters}>
                <div>
                  <input type="checkbox" id="l" value="l" name="letters" />
                  <label htmlFor="l">L</label>
                </div>
                <div>
                  <input type="checkbox" id="g" value="g" name="letters" />
                  <label htmlFor="g">G</label>
                </div>
                <div>
                  <input type="checkbox" id="b" value="b" name="letters" />
                  <label htmlFor="b">B</label>
                </div>
                <div>
                  <input type="checkbox" id="t" value="t" name="letters" />
                  <label htmlFor="t">T</label>
                </div>
                <div>
                  <input type="checkbox" id="qr" value="qr" name="letters" />
                  <label htmlFor="qr">Q</label>
                </div>
                <div>
                  <input type="checkbox" id="qs" value="qs" name="letters" />
                  <label htmlFor="qs">Q</label>
                </div>
                <div>
                  <input type="checkbox" id="i" value="i" name="letters" />
                  <label htmlFor="i">I</label>
                </div>
                <div>
                  <input type="checkbox" id="a" value="a" name="letters" />
                  <label htmlFor="a">A</label>
                </div>
              </div>
            </h1>
            <div className={stdStyles.details}>
              <PronounPicker />
              <div className={stdStyles.social}>
                <span>You can find them here:</span>
                <ul className={stdStyles.socialLinks}>
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
            </div>
          </header>
          <div dangerouslySetInnerHTML={{ __html: md.render(testMd) }} />
        </div>
        <footer>
          <button type="submit">Save Changes</button>
        </footer>
      </form>
    );
  }
}

export default ProfileEdit;
