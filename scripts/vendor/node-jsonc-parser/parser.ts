/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { createScanner } from './scanner.ts';
import {
	JSONPath,
	JSONVisitor,
	Location,
	Node,
	NodeType,
	ParseError,
	ParseErrorCode,
	ParseOptions,
	ScanError,
	Segment,
	SyntaxKind
} from './jsonc.ts';;

namespace ParseOptions {
	export const DEFAULT = {
		allowTrailingComma: false
	};
}

interface NodeImpl extends Node {
	type: NodeType;
	value?: any;
	offset: number;
	length: number;
	colonOffset?: number;
	parent?: NodeImpl;
	children?: NodeImpl[];
}

/**
 * For a given offset, evaluate the location in the JSON document. Each segment in the location path is either a property name or an array index.
 */
export function getLocation(text: string, position: number): Location {
	const segments: Segment[] = []; // strings or numbers
	const earlyReturnException = new Object();
	let previousNode: NodeImpl | undefined = undefined;
	const previousNodeInst: NodeImpl = {
		value: {},
		offset: 0,
		length: 0,
		type: 'object',
		parent: undefined
	};
	let isAtPropertyKey = false;
	function setPreviousNode(value: string, offset: number, length: number, type: NodeType) {
		previousNodeInst.value = value;
		previousNodeInst.offset = offset;
		previousNodeInst.length = length;
		previousNodeInst.type = type;
		previousNodeInst.colonOffset = undefined;
		previousNode = previousNodeInst;
	}
	try {

		visit(text, {
			onObjectBegin: (offset: number, length: number) => {
				if (position <= offset) {
					throw earlyReturnException;
				}
				previousNode = undefined;
				isAtPropertyKey = position > offset;
				segments.push(''); // push a placeholder (will be replaced)
			},
			onObjectProperty: (name: string, offset: number, length: number) => {
				if (position < offset) {
					throw earlyReturnException;
				}
				setPreviousNode(name, offset, length, 'property');
				segments[segments.length - 1] = name;
				if (position <= offset + length) {
					throw earlyReturnException;
				}
			},
			onObjectEnd: (offset: number, length: number) => {
				if (position <= offset) {
					throw earlyReturnException;
				}
				previousNode = undefined;
				segments.pop();
			},
			onArrayBegin: (offset: number, length: number) => {
				if (position <= offset) {
					throw earlyReturnException;
				}
				previousNode = undefined;
				segments.push(0);
			},
			onArrayEnd: (offset: number, length: number) => {
				if (position <= offset) {
					throw earlyReturnException;
				}
				previousNode = undefined;
				segments.pop();
			},
			onLiteralValue: (value: any, offset: number, length: number) => {
				if (position < offset) {
					throw earlyReturnException;
				}
				setPreviousNode(value, offset, length, getNodeType(value));

				if (position <= offset + length) {
					throw earlyReturnException;
				}
			},
			onSeparator: (sep: string, offset: number, length: number) => {
				if (position <= offset) {
					throw earlyReturnException;
				}
				if (sep === ':' && previousNode && previousNode.type === 'property') {
					previousNode.colonOffset = offset;
					isAtPropertyKey = false;
					previousNode = undefined;
				} else if (sep === ',') {
					const last = segments[segments.length - 1];
					if (typeof last === 'number') {
						segments[segments.length - 1] = last + 1;
					} else {
						isAtPropertyKey = true;
						segments[segments.length - 1] = '';
					}
					previousNode = undefined;
				}
			}
		});
	} catch (e) {
		if (e !== earlyReturnException) {
			throw e;
		}
	}

	return {
		path: segments,
		previousNode,
		isAtPropertyKey,
		matches: (pattern: Segment[]) => {
			let k = 0;
			for (let i = 0; k < pattern.length && i < segments.length; i++) {
				if (pattern[k] === segments[i] || pattern[k] === '*') {
					k++;
				} else if (pattern[k] !== '**') {
					return false;
				}
			}
			return k === pattern.length;
		}
	};
}


/**
 * Parses the given text and returns the object the JSON content represents. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
 * Therefore always check the errors list to find out if the input was valid.
 */
export function parse(text: string, errors: ParseError[] = [], options: ParseOptions = ParseOptions.DEFAULT): any {
	let currentProperty: string | null = null;
	let currentParent: any = [];
	const previousParents: any[] = [];

	function onValue(value: any) {
		if (Array.isArray(currentParent)) {
			(<any[]>currentParent).push(value);
		} else if (currentProperty !== null) {
			currentParent[currentProperty] = value;
		}
	}

	const visitor: JSONVisitor = {
		onObjectBegin: () => {
			const object = {};
			onValue(object);
			previousParents.push(currentParent);
			currentParent = object;
			currentProperty = null;
		},
		onObjectProperty: (name: string) => {
			currentProperty = name;
		},
		onObjectEnd: () => {
			currentParent = previousParents.pop();
		},
		onArrayBegin: () => {
			const array: any[] = [];
			onValue(array);
			previousParents.push(currentParent);
			currentParent = array;
			currentProperty = null;
		},
		onArrayEnd: () => {
			currentParent = previousParents.pop();
		},
		onLiteralValue: onValue,
		onError: (error: ParseErrorCode, offset: number, length: number) => {
			errors.push({ error, offset, length });
		}
	};
	visit(text, visitor, options);
	return currentParent[0];
}


/**
 * Parses the given text and returns a tree representation the JSON content. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
 */
export function parseTree(text: string, errors: ParseError[] = [], options: ParseOptions = ParseOptions.DEFAULT): Node {
	let currentParent: NodeImpl = { type: 'array', offset: -1, length: -1, children: [], parent: undefined }; // artificial root

	function ensurePropertyComplete(endOffset: number) {
		if (currentParent.type === 'property') {
			currentParent.length = endOffset - currentParent.offset;
			currentParent = currentParent.parent!;
		}
	}

	function onValue(valueNode: Node): Node {
		currentParent.children!.push(valueNode);
		return valueNode;
	}

	const visitor: JSONVisitor = {
		onObjectBegin: (offset: number) => {
			currentParent = onValue({ type: 'object', offset, length: -1, parent: currentParent, children: [] });
		},
		onObjectProperty: (name: string, offset: number, length: number) => {
			currentParent = onValue({ type: 'property', offset, length: -1, parent: currentParent, children: [] });
			currentParent.children!.push({ type: 'string', value: name, offset, length, parent: currentParent });
		},
		onObjectEnd: (offset: number, length: number) => {
			ensurePropertyComplete(offset + length); // in case of a missing value for a property: make sure property is complete

			currentParent.length = offset + length - currentParent.offset;
			currentParent = currentParent.parent!;
			ensurePropertyComplete(offset + length);
		},
		onArrayBegin: (offset: number, length: number) => {
			currentParent = onValue({ type: 'array', offset, length: -1, parent: currentParent, children: [] });
		},
		onArrayEnd: (offset: number, length: number) => {
			currentParent.length = offset + length - currentParent.offset;
			currentParent = currentParent.parent!;
			ensurePropertyComplete(offset + length);
		},
		onLiteralValue: (value: any, offset: number, length: number) => {
			onValue({ type: getNodeType(value), offset, length, parent: currentParent, value });
			ensurePropertyComplete(offset + length);
		},
		onSeparator: (sep: string, offset: number, length: number) => {
			if (currentParent.type === 'property') {
				if (sep === ':') {
					currentParent.colonOffset = offset;
				} else if (sep === ',') {
					ensurePropertyComplete(offset);
				}
			}
		},
		onError: (error: ParseErrorCode, offset: number, length: number) => {
			errors.push({ error, offset, length });
		}
	};
	visit(text, visitor, options);

	const result = currentParent.children![0];
	if (result) {
		delete result.parent;
	}
	return result;
}

/**
 * Finds the node at the given path in a JSON DOM.
 */
export function findNodeAtLocation(root: Node, path: JSONPath): Node | undefined {
	if (!root) {
		return undefined;
	}
	let node = root;
	for (let segment of path) {
		if (typeof segment === 'string') {
			if (node.type !== 'object' || !Array.isArray(node.children)) {
				return undefined;
			}
			let found = false;
			for (const propertyNode of node.children) {
				if (Array.isArray(propertyNode.children) && propertyNode.children[0].value === segment) {
					node = propertyNode.children[1];
					found = true;
					break;
				}
			}
			if (!found) {
				return undefined;
			}
		} else {
			const index = <number>segment;
			if (node.type !== 'array' || index < 0 || !Array.isArray(node.children) || index >= node.children.length) {
				return undefined;
			}
			node = node.children[index];
		}
	}
	return node;
}

/**
 * Gets the JSON path of the given JSON DOM node
 */
export function getNodePath(node: Node): JSONPath {
	if (!node.parent || !node.parent.children) {
		return [];
	}
	const path = getNodePath(node.parent);
	if (node.parent.type === 'property') {
		const key = node.parent.children[0].value;
		path.push(key);
	} else if (node.parent.type === 'array') {
		const index = node.parent.children.indexOf(node);
		if (index !== -1) {
			path.push(index);
		}
	}
	return path;
}

/**
 * Evaluates the JavaScript object of the given JSON DOM node
 */
export function getNodeValue(node: Node): any {
	switch (node.type) {
		case 'array':
			return node.children!.map(getNodeValue);
		case 'object':
			const obj = Object.create(null);
			for (let prop of node.children!) {
				const valueNode = prop.children![1];
				if (valueNode) {
					obj[prop.children![0].value] = getNodeValue(valueNode);
				}
			}
			return obj;
		case 'null':
		case 'string':
		case 'number':
		case 'boolean':
			return node.value;
		default:
			return undefined;
	}

}

export function contains(node: Node, offset: number, includeRightBound = false): boolean {
	return (offset >= node.offset && offset < (node.offset + node.length)) || includeRightBound && (offset === (node.offset + node.length));
}

/**
 * Finds the most inner node at the given offset. If includeRightBound is set, also finds nodes that end at the given offset.
 */
export function findNodeAtOffset(node: Node, offset: number, includeRightBound = false): Node | undefined {
	if (contains(node, offset, includeRightBound)) {
		const children = node.children;
		if (Array.isArray(children)) {
			for (let i = 0; i < children.length && children[i].offset <= offset; i++) {
				const item = findNodeAtOffset(children[i], offset, includeRightBound);
				if (item) {
					return item;
				}
			}

		}
		return node;
	}
	return undefined;
}


/**
 * Parses the given text and invokes the visitor functions for each object, array and literal reached.
 */
export function visit(text: string, visitor: JSONVisitor, options: ParseOptions = ParseOptions.DEFAULT): any {

	const _scanner = createScanner(text, false);

	function toNoArgVisit(visitFunction?: (offset: number, length: number, startLine: number, startCharacter: number) => void): () => void {
		return visitFunction ? () => visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
	}
	function toOneArgVisit<T>(visitFunction?: (arg: T, offset: number, length: number, startLine: number, startCharacter: number) => void): (arg: T) => void {
		return visitFunction ? (arg: T) => visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
	}

	const onObjectBegin = toNoArgVisit(visitor.onObjectBegin),
		onObjectProperty = toOneArgVisit(visitor.onObjectProperty),
		onObjectEnd = toNoArgVisit(visitor.onObjectEnd),
		onArrayBegin = toNoArgVisit(visitor.onArrayBegin),
		onArrayEnd = toNoArgVisit(visitor.onArrayEnd),
		onLiteralValue = toOneArgVisit(visitor.onLiteralValue),
		onSeparator = toOneArgVisit(visitor.onSeparator),
		onComment = toNoArgVisit(visitor.onComment),
		onError = toOneArgVisit(visitor.onError);

	const disallowComments = options && options.disallowComments;
	const allowTrailingComma = options && options.allowTrailingComma;
	function scanNext(): number {
		while (true) {
			const token = _scanner.scan();
			switch (_scanner.getTokenError()) {
				case ScanError.InvalidUnicode:
					handleError(ParseErrorCode.InvalidUnicode);
					break;
				case ScanError.InvalidEscapeCharacter:
					handleError(ParseErrorCode.InvalidEscapeCharacter);
					break;
				case ScanError.UnexpectedEndOfNumber:
					handleError(ParseErrorCode.UnexpectedEndOfNumber);
					break;
				case ScanError.UnexpectedEndOfComment:
					if (!disallowComments) {
						handleError(ParseErrorCode.UnexpectedEndOfComment);
					}
					break;
				case ScanError.UnexpectedEndOfString:
					handleError(ParseErrorCode.UnexpectedEndOfString);
					break;
				case ScanError.InvalidCharacter:
					handleError(ParseErrorCode.InvalidCharacter);
					break;
			}
			switch (token) {
				case SyntaxKind.LineCommentTrivia:
				case SyntaxKind.BlockCommentTrivia:
					if (disallowComments) {
						handleError(ParseErrorCode.InvalidCommentToken);
					} else {
						onComment();
					}
					break;
				case SyntaxKind.Unknown:
					handleError(ParseErrorCode.InvalidSymbol);
					break;
				case SyntaxKind.Trivia:
				case SyntaxKind.LineBreakTrivia:
					break;
				default:
					return token;
			}
		}
	}

	function handleError(error: ParseErrorCode, skipUntilAfter: number[] = [], skipUntil: number[] = []): void {
		onError(error);
		if (skipUntilAfter.length + skipUntil.length > 0) {
			let token = _scanner.getToken();
			while (token !== SyntaxKind.EOF) {
				if (skipUntilAfter.indexOf(token) !== -1) {
					scanNext();
					break;
				} else if (skipUntil.indexOf(token) !== -1) {
					break;
				}
				token = scanNext();
			}
		}
	}

	function parseString(isValue: boolean): boolean {
		const value = _scanner.getTokenValue();
		if (isValue) {
			onLiteralValue(value);
		} else {
			onObjectProperty(value);
		}
		scanNext();
		return true;
	}

	function parseLiteral(): boolean {
		switch (_scanner.getToken()) {
			case SyntaxKind.NumericLiteral:
				let value = 0;
				try {
					value = JSON.parse(_scanner.getTokenValue());
					if (typeof value !== 'number') {
						handleError(ParseErrorCode.InvalidNumberFormat);
						value = 0;
					}
				} catch (e) {
					handleError(ParseErrorCode.InvalidNumberFormat);
				}
				onLiteralValue(value);
				break;
			case SyntaxKind.NullKeyword:
				onLiteralValue(null);
				break;
			case SyntaxKind.TrueKeyword:
				onLiteralValue(true);
				break;
			case SyntaxKind.FalseKeyword:
				onLiteralValue(false);
				break;
			default:
				return false;
		}
		scanNext();
		return true;
	}

	function parseProperty(): boolean {
		if (_scanner.getToken() !== SyntaxKind.StringLiteral) {
			handleError(ParseErrorCode.PropertyNameExpected, [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
			return false;
		}
		parseString(false);
		if (_scanner.getToken() === SyntaxKind.ColonToken) {
			onSeparator(':');
			scanNext(); // consume colon

			if (!parseValue()) {
				handleError(ParseErrorCode.ValueExpected, [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
			}
		} else {
			handleError(ParseErrorCode.ColonExpected, [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
		}
		return true;
	}

	function parseObject(): boolean {
		onObjectBegin();
		scanNext(); // consume open brace

		let needsComma = false;
		while (_scanner.getToken() !== SyntaxKind.CloseBraceToken && _scanner.getToken() !== SyntaxKind.EOF) {
			if (_scanner.getToken() === SyntaxKind.CommaToken) {
				if (!needsComma) {
					handleError(ParseErrorCode.ValueExpected, [], []);
				}
				onSeparator(',');
				scanNext(); // consume comma
				if (_scanner.getToken() === SyntaxKind.CloseBraceToken && allowTrailingComma) {
					break;
				}
			} else if (needsComma) {
				handleError(ParseErrorCode.CommaExpected, [], []);
			}
			if (!parseProperty()) {
				handleError(ParseErrorCode.ValueExpected, [], [SyntaxKind.CloseBraceToken, SyntaxKind.CommaToken]);
			}
			needsComma = true;
		}
		onObjectEnd();
		if (_scanner.getToken() !== SyntaxKind.CloseBraceToken) {
			handleError(ParseErrorCode.CloseBraceExpected, [SyntaxKind.CloseBraceToken], []);
		} else {
			scanNext(); // consume close brace
		}
		return true;
	}

	function parseArray(): boolean {
		onArrayBegin();
		scanNext(); // consume open bracket

		let needsComma = false;
		while (_scanner.getToken() !== SyntaxKind.CloseBracketToken && _scanner.getToken() !== SyntaxKind.EOF) {
			if (_scanner.getToken() === SyntaxKind.CommaToken) {
				if (!needsComma) {
					handleError(ParseErrorCode.ValueExpected, [], []);
				}
				onSeparator(',');
				scanNext(); // consume comma
				if (_scanner.getToken() === SyntaxKind.CloseBracketToken && allowTrailingComma) {
					break;
				}
			} else if (needsComma) {
				handleError(ParseErrorCode.CommaExpected, [], []);
			}
			if (!parseValue()) {
				handleError(ParseErrorCode.ValueExpected, [], [SyntaxKind.CloseBracketToken, SyntaxKind.CommaToken]);
			}
			needsComma = true;
		}
		onArrayEnd();
		if (_scanner.getToken() !== SyntaxKind.CloseBracketToken) {
			handleError(ParseErrorCode.CloseBracketExpected, [SyntaxKind.CloseBracketToken], []);
		} else {
			scanNext(); // consume close bracket
		}
		return true;
	}

	function parseValue(): boolean {
		switch (_scanner.getToken()) {
			case SyntaxKind.OpenBracketToken:
				return parseArray();
			case SyntaxKind.OpenBraceToken:
				return parseObject();
			case SyntaxKind.StringLiteral:
				return parseString(true);
			default:
				return parseLiteral();
		}
	}

	scanNext();
	if (_scanner.getToken() === SyntaxKind.EOF) {
		if (options.allowEmptyContent) {
			return true;
		}
		handleError(ParseErrorCode.ValueExpected, [], []);
		return false;
	}
	if (!parseValue()) {
		handleError(ParseErrorCode.ValueExpected, [], []);
		return false;
	}
	if (_scanner.getToken() !== SyntaxKind.EOF) {
		handleError(ParseErrorCode.EndOfFileExpected, [], []);
	}
	return true;
}

/**
 * Takes JSON with JavaScript-style comments and remove
 * them. Optionally replaces every none-newline character
 * of comments with a replaceCharacter
 */
export function stripComments(text: string, replaceCh?: string): string {

	let _scanner = createScanner(text),
		parts: string[] = [],
		kind: number,
		offset = 0,
		pos: number;

	do {
		pos = _scanner.getPosition();
		kind = _scanner.scan();
		switch (kind) {
			case SyntaxKind.LineCommentTrivia:
			case SyntaxKind.BlockCommentTrivia:
			case SyntaxKind.EOF:
				if (offset !== pos) {
					parts.push(text.substring(offset, pos));
				}
				if (replaceCh !== undefined) {
					parts.push(_scanner.getTokenValue().replace(/[^\r\n]/g, replaceCh));
				}
				offset = _scanner.getPosition();
				break;
		}
	} while (kind !== SyntaxKind.EOF);

	return parts.join('');
}

export function getNodeType(value: any): NodeType {
	switch (typeof value) {
		case 'boolean': return 'boolean';
		case 'number': return 'number';
		case 'string': return 'string';
		case 'object': {
			if (!value) {
				return 'null';
			} else if (Array.isArray(value)) {
				return 'array';
			}
			return 'object';
		}
		default: return 'null';
	}
}
