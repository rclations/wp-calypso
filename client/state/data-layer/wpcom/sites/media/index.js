/**
 * Internal dependencies
 */
import { dispatchRequest } from 'state/data-layer/wpcom-http/utils';
import { http } from 'state/data-layer/wpcom-http/actions';
import { isRequestingMedia } from 'state/selectors';
import { MEDIA_REQUEST, MEDIA_ITEM_REQUEST } from 'state/action-types';
import {
	failMediaRequest,
	failMediaItemRequest,
	receiveMedia,
	requestingMedia,
	requestingMediaItem,
	successMediaRequest,
	successMediaItemRequest
} from 'state/media/actions';
import wpcom from 'lib/wp';
import debug from 'debug';

/**
 * Module variables
 */
const log = debug( 'calypso:middleware-media' );

/**
 * Issues an API request to fetch media for a site and query.
 *
 * @param  {Object}  store  Redux store
 * @param  {Object}  action Action object
 * @return {Promise}        Promise
 */
export function requestMedia( { dispatch, getState }, { siteId, query } ) {
	if ( isRequestingMedia( getState(), siteId, query ) ) {
		return;
	}

	dispatch( requestingMedia( siteId, query ) );

	log( 'Request media for site %d using query %o', siteId, query );

	return wpcom
		.site( siteId )
		.mediaList( query )
		.then( ( { media, found } ) => {
			dispatch( receiveMedia( siteId, media, found, query ) );
			dispatch( successMediaRequest( siteId, query ) );
		}	)
		.catch( () => dispatch( failMediaRequest( siteId, query ) ) );
}

export function handleMediaItemRequest( { dispatch }, action ) {
	const { mediaId, query, siteId } = action;

	dispatch( requestingMediaItem( siteId, query ) );

	log( 'Request media item %d for site %d', mediaId, siteId );

	dispatch(
		http(
			{
				apiVersion: '1.2',
				method: 'GET',
				path: `/sites/${ siteId }/media/${ mediaId }`,
				query,
			},
			action
		)
	);
}

export function receiveMediaItem( { dispatch }, { mediaId, siteId }, media ) {
	dispatch( receiveMedia( siteId, media ) );
	dispatch( successMediaItemRequest( siteId, mediaId ) );
}

export function receiveMediaItemError( { dispatch }, { mediaId, siteId } ) {
	dispatch( failMediaItemRequest( siteId, mediaId ) );
}

export default {
	[ MEDIA_REQUEST ]: [ requestMedia ],
	[ MEDIA_ITEM_REQUEST ]: [
		dispatchRequest( handleMediaItemRequest, receiveMediaItem, receiveMediaItemError ),
	],
};
