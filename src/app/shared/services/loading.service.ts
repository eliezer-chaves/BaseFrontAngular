import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    // Use a object {[key: string]: boolean } to store loading states for different buttons
    // This allows us to track loading states for multiple buttons
    // Signal to manage loading states
    private loadingStates = signal<Record<string, boolean>>({});

    // Starts the loading for a specific button
    // buttonName: string - the name of the button to track loading state
    startLoading(buttonName: string) {
        this.loadingStates.update((states) => ({
            ...states,
            [buttonName]: true,
        }));
    }

    // Stops the loading for a specific button
    // buttonName: string - the name of the button to stop loading state
    stopLoading(buttonName: string) {
        this.loadingStates.update((states) => ({
            ...states,
            [buttonName]: false,
        }));
    }

    // Gets the current loading states
    // Returns an object with button names as keys and their loading states as values
    isLoading(buttonName: string): boolean {
        return this.loadingStates()[buttonName] || false;
    }
}