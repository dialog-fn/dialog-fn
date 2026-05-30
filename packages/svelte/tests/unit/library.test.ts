import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it } from 'vitest';
import DialogRegister from '../../src/lib/library.svelte';
import TestDialog from './TestDialog.svelte';

describe('DialogRegister (svelte adapter)', () => {
	it('renders the dialog closed by default', () => {
		render(DialogRegister, { props: { dialogComponent: TestDialog } });
		expect(screen.getByTestId('open')).toHaveTextContent('false');
	});

	it('opens with data and resolves on confirm', async () => {
		const { component } = render(DialogRegister, { props: { dialogComponent: TestDialog } });
		const result = (component as any).showDialog({ foo: 'bar' });
		await tick();

		expect(screen.getByTestId('open')).toHaveTextContent('true');
		expect(screen.getByTestId('data')).toHaveTextContent('{"foo":"bar"}');

		await fireEvent.click(screen.getByText('confirm'));
		await expect(result).resolves.toEqual({ bar: 'ok' });
		expect(screen.getByTestId('open')).toHaveTextContent('false');
	});

	it('resolves with undefined when dismissed', async () => {
		const { component } = render(DialogRegister, { props: { dialogComponent: TestDialog } });
		const result = (component as any).showDialog({ foo: 'bar' });
		await tick();

		await fireEvent.click(screen.getByText('close'));
		await expect(result).resolves.toBeUndefined();
	});

	it('exposes showDialog.close() for parity with react', async () => {
		const { component } = render(DialogRegister, { props: { dialogComponent: TestDialog } });
		const result = (component as any).showDialog({ foo: 'bar' });
		await tick();

		(component as any).showDialog.close();
		await expect(result).resolves.toBeUndefined();
	});

	it('stays unmounted until opened when forceUnmount is set', async () => {
		const { component } = render(DialogRegister, {
			props: { dialogComponent: TestDialog, forceUnmount: true }
		});
		expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();

		(component as any).showDialog({ foo: 'bar' });
		await tick();
		expect(screen.getByTestId('dialog')).toBeInTheDocument();
	});
});
