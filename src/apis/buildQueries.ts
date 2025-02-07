import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import {BaseEntity, ListOptions, ListResponse} from "@entities/Server";
import { BeValidationException } from "@entities/ValidationError";
import { queryClient } from "@config/index";
import { CrudApi } from "@apis/CrudApi";
import {objToStr} from "@apis/httpCache"; // Adjust this import to where your CrudApi is defined

/**
 * Builds TanStack Query options for a given entity using a CrudApi instance.
 *
 * @template Entity - The entity type, which must have an `id` property.
 * @param keyName - A unique key name for the entity (e.g. "SerialKiller").
 * @param api - An instance of CrudApi for the entity.
 * @returns An object with the following properties:
 *    - view: a function to generate view query options,
 *    - list: a query options object for listing entities,
 *    - save: mutation options for saving an entity.
 */
export const buildQueries = <Entity extends BaseEntity>(
    keyName: string,
    api: CrudApi<Entity>
) => {
    const handleMutationResult = (
        result: Entity | BeValidationException<Entity>
    ): Entity => {
        if (result && "message" in result) {
            throw result;
        }
        return result as Entity;
    };

    const handleMutationSuccess = async (data: Entity): Promise<void> => {
        queryClient.setQueryData([keyName, String(data.id)], data);
        await queryClient.invalidateQueries({ queryKey: [`${keyName}List`] });
    };

    const viewQueryFunc = (id: string | number): UseQueryOptions<Entity> => ({
        queryKey: [keyName, String(id)],
        queryFn: () => api.read(id),
        staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes.
        gcTime: 1000 * 60 * 10,   // Keep cached data for 10 minutes after becoming inactive.
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const listQueryFunc = (listOptions: ListOptions): UseQueryOptions<ListResponse<Entity>> => ({
        queryKey: [`${keyName}List`, objToStr(listOptions)],
        queryFn: () => api.list(listOptions),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount:true,
    })

    const saveMutateOptions: UseMutationOptions<
        Entity,
        BeValidationException<Entity>,
        Partial<Entity>
    > = {
        mutationFn: (payload) => api.save(payload).then(handleMutationResult),
        onSuccess: handleMutationSuccess,
    };

    return { view: viewQueryFunc, list: listQueryFunc, save: saveMutateOptions };
};
