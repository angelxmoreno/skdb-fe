import {Answer, SerialKiller} from "@entities/Models";
import SerialKillersApi from "@apis/resources/SerialKillersApi";
import {buildQueries} from "@apis/buildQueries";
import {UseQueryOptions} from "@tanstack/react-query";

const SerialKillerQueries = {
    ...buildQueries<SerialKiller>('SerialKiller', SerialKillersApi),
    answer: (id: number | string, question_id: number | string): UseQueryOptions<Answer> => ({
        queryKey: ['SerialKillerAnswer', `id:${id}::question:${question_id}`],
        queryFn: () => SerialKillersApi.answer(id, question_id),
        staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes.
        gcTime: 1000 * 60 * 10,   // Keep cached data for 10 minutes after becoming inactive.
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}

export default SerialKillerQueries;