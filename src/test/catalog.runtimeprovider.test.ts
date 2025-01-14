'use strict';

import * as vscode from 'vscode';
import * as chai from 'chai';
import { getDocUri, activate } from './helper';
import { checkExpectedCompletion, checkNotExpectedCompletion } from './completion.util';

const expect = chai.expect;

const RUNTIME_PROVIDER_SETTINGS_KEY = 'camel.Camel catalog runtime provider';

describe('Should do completion in Camel URI using the Camel Catalog version specified in preference', () => {
	const docUriXml = getDocUri('test-catalog-version.xml');
	const expectedCompletion = { label: 'jgroups-raft:clusterName'};

	afterEach(() => {
		const config = vscode.workspace.getConfiguration();
		config.update(RUNTIME_PROVIDER_SETTINGS_KEY, undefined);
	});

	it('Updated Catalog runtime provider is reflected in completion', async () => {
		await activate(docUriXml);
		const config = vscode.workspace.getConfiguration();
		expect(config.get(RUNTIME_PROVIDER_SETTINGS_KEY)).to.not.be.equal('KARAF');
		await checkExpectedCompletion(docUriXml, new vscode.Position(0, 21), expectedCompletion);
		await config.update(RUNTIME_PROVIDER_SETTINGS_KEY, 'KARAF');

		await checkNotExpectedCompletion(docUriXml, new vscode.Position(0, 21), expectedCompletion);

		await config.update(RUNTIME_PROVIDER_SETTINGS_KEY, undefined);
		await checkExpectedCompletion(docUriXml, new vscode.Position(0, 21), expectedCompletion);
	});

});
