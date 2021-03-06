import React, { FormEvent } from 'react';
import gql from 'graphql-tag';
import { ChildDataProps, graphql } from 'react-apollo';
import cn from 'classnames';

import { slugifyName } from '../../../lib/NameUtils';

const styles = require('./NameStep.css');

const query = gql`
  query validateName($name: String!) {
    validateName(name: $name) {
      available
      slug
    }
  }
`;

type ValidName = {
  available: boolean;
  slug: string;
};

type Response = {
  validateName: ValidName;
};

type Variables = {
  name: String;
};

type InputProps = {
  name: string;
  hasError: boolean;
  available?: boolean;
  slug?: string;
  onClaim: (slug: string) => void;
};

type ChildProps = ChildDataProps<InputProps, Response, Variables>;

function NameStatus({ available, slug, name, hasError, onClaim }: ChildProps) {
  if (!name) {
    return <div className={styles.nameStatus} />;
  }

  if (hasError) {
    return (
      <div className={cn(styles.nameStatus, styles.show)}>
        <p>This isn't a valid name.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(styles.nameStatus, styles.show, {
        [styles.available]: available,
        [styles.unavailable]: !available
      })}
    >
      <p>
        {available
          ? `${slug}.is.actually.lgbt is available.`
          : `${slug}.is.actually.lgbt has already been taken.`}
      </p>
      <button className={styles.claimButton} onClick={() => onClaim(slug)}>
        Gimme!
      </button>
    </div>
  );
}

export default graphql<InputProps, Response, Variables, ChildProps>(query, {
  skip(props) {
    return !Boolean(props.name);
  },
  options({ name }) {
    return {
      variables: {
        name: slugifyName(name)
      }
    };
  },
  props({ data, ownProps }) {
    const { validateName } = data;
    return {
      ...ownProps,
      data,
      available: validateName ? validateName.available : false,
      slug: validateName ? validateName.slug : ''
    };
  }
})(NameStatus);
