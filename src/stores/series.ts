import { defineStore } from "pinia";
import { listSeries, createSeries, deleteSeries, editSeries } from "@/backend/services/seriesService";
import type { Series, SeriesPayload } from "@/backend/services/series.types"

export const useSeriesStore = defineStore("series", {
    state: () => ({
        series: [] as Series[]
    }),

    actions: {
        async listSeries() {
            this.series = await listSeries();
        },

        async createSeries(data: SeriesPayload) {
            const newSeries = await createSeries(data);
            this.series.push(newSeries);
        },

        async deleteSeries(id: string) {
            await deleteSeries(id);
            this.series = this.series.filter(series => series.id !== id);
        },

        async editSeries(id: string, data: SeriesPayload) {
            const updatedSeries = await editSeries(id, data);
            const index = this.series.findIndex(series => series.id === id);
            
            if (index !== -1) {
                this.series[index] = updatedSeries;
            }
        }
    }
});