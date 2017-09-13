/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { MEDIA_ITEM_REQUEST } from 'state/action-types';
import { http } from 'state/data-layer/wpcom-http/actions';
import { useSandbox } from 'test/helpers/use-sinon';
import { handleMediaItemRequest, receiveMediaItem, receiveMediaItemError } from '../';
import {
	failMediaItemRequest,
	receiveMedia,
	requestingMediaItem,
	successMediaItemRequest
} from 'state/media/actions';

describe( 'handleMediaItemRequest', () => {
	let dispatch;

	useSandbox( sandbox => ( dispatch = sandbox.spy() ) );

	it( 'should dispatch an http action', () => {
		const siteId = 12345;
		const mediaId = 67890;
		const action = {
			type: MEDIA_ITEM_REQUEST,
			mediaId,
			siteId,
		};
		handleMediaItemRequest( { dispatch }, action );
		expect( dispatch ).to.have.been.calledTwice;
		expect( dispatch ).to.have.been.calledWith(
			requestingMediaItem( siteId )
		);
		expect( dispatch ).to.have.been.calledWith(
			http(
				{
					apiVersion: '1.2',
					method: 'GET',
					path: `/sites/${ siteId }/media/${ mediaId }`,
				},
				action
			)
		);
	} );
} );

describe( 'receiveMediaItem', () => {
	let dispatch;

	useSandbox( sandbox => ( dispatch = sandbox.spy() ) );

	it( 'should dispatch media recieve actions', () => {
		const siteId = 12345;
		const mediaId = 67890;
		const action = {
			type: MEDIA_ITEM_REQUEST,
			mediaId,
			siteId,
		};
		const media = { ID: 91827364 };
		receiveMediaItem( { dispatch }, action, media );
		expect( dispatch ).to.have.been.calledTwice,
		expect( dispatch ).to.have.been.calledWith(
			receiveMedia( siteId, media )
		);
		expect( dispatch ).to.have.been.calledWith(
			successMediaItemRequest( siteId, mediaId )
		);
	} );
} );

describe( 'receiveMediaItemError', () => {
	let dispatch;

	useSandbox( sandbox => ( dispatch = sandbox.spy() ) );

	it( 'should dispatch failure', () => {
		const siteId = 12345;
		const mediaId = 67890;
		const action = {
			type: MEDIA_ITEM_REQUEST,
			mediaId,
			siteId,
		};
		receiveMediaItemError( { dispatch }, action );
		expect( dispatch ).to.have.been.calledWith(
			failMediaItemRequest( siteId, mediaId )
		);
	} );
} );
