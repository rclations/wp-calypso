/** @format */

/**
 * External dependencies
 */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { localize } from 'i18n-calypso';
import { flow, get } from 'lodash';

/**
 * Internal dependencies
 */
import { selectPostRevision } from 'state/posts/revisions/actions';
import { isSingleUserSite } from 'state/sites/selectors';
import PostTime from 'reader/post-time';

class EditorRevisionsListItem extends PureComponent {
	selectRevision = () => {
		this.props.selectPostRevision( this.props.revision.id );
	};

	render() {
		const { revision, isMultiUserSite, translate } = this.props;
		const authorName = get( revision, 'author.display_name' );
		const added = get( revision, 'changes.added' );
		const removed = get( revision, 'changes.removed' );

		return (
			<button
				className="editor-revisions-list__button"
				onClick={ this.selectRevision }
				type="button"
			>
				<span className="editor-revisions-list__date">
					<PostTime date={ revision.date } />
				</span>

				{ authorName &&
					isMultiUserSite && <span className="editor-revisions-list__author">{ authorName }</span> }

				<div className="editor-revisions-list__changes">
					{ added > 0 && (
						<span
							className="editor-revisions-list__additions"
							aria-label={ translate( '%(changes)d word added', '%(changes)d words added', {
								args: { changes: added },
								count: added,
							} ) }
						>
							<b>+</b>
							{ added }
						</span>
					) }

					{ removed > 0 && (
						<span
							className="editor-revisions-list__deletions"
							aria-label={ translate( '%(changes)d word removed', '%(changes)d words removed', {
								args: { changes: removed },
								count: removed,
							} ) }
						>
							<b>-</b>
							{ removed }
						</span>
					) }

					{ added === 0 &&
						removed === 0 && (
							<span className="editor-revisions-list__minor-changes">
								{ translate( 'minor', { context: 'post revisions: minor changes' } ) }
							</span>
						) }
				</div>
			</button>
		);
	}
}

EditorRevisionsListItem.propTypes = {
	revision: PropTypes.object.isRequired,
	siteId: PropTypes.number.isRequired,

	// connected to state
	isMultiUserSite: PropTypes.bool.isRequired,

	// connected to dispatcher
	selectPostRevision: PropTypes.func.isRequired,

	// localize
	translate: PropTypes.func.isRequired,
};

export default flow(
	localize,
	connect(
		( state, { siteId } ) => ( {
			isMultiUserSite: ! isSingleUserSite( state, siteId ),
		} ),
		{ selectPostRevision }
	)
)( EditorRevisionsListItem );
