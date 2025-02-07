import {UseMutationOptions, UseQueryOptions} from "@tanstack/react-query";
import { SerialKiller} from "@entities/SerialKiller";
import SerialKillersApi from "@apis/resources/SerialKillersApi";
import {ListResponse} from "@entities/Server";
import {BeValidationException} from "@entities/ValidationError";

import {queryClient} from "@config/index";

const keyName = 'SerialKiller';
type Entity = SerialKiller;
const api = SerialKillersApi;

const handleMutationResult = (result:Entity|BeValidationException<Entity>)=> {
    if (result && 'message' in result) {
        throw result;
    }

    return result as SerialKiller;
}

const handleMutationSuccess = async (data: Entity) => {
    queryClient.setQueryData([keyName, String(data.id)], data);
    await queryClient.invalidateQueries({
        queryKey: [`${keyName}List`],
    });
};

const viewQueryFunc = (id: string | number): UseQueryOptions<Entity> => ({
    queryKey: [keyName, String(id)],
    queryFn: () => api.read(id),
});

const listQueryFunc: UseQueryOptions<ListResponse<Entity>> = {
    queryKey: [`${keyName}List`],
    queryFn: () => api.list(),
}

const saveMutateOptions: UseMutationOptions<Entity, BeValidationException<Entity>, Partial<Entity>> = {
    mutationFn: payload => api.save(payload).then(handleMutationResult),
    onSuccess: handleMutationSuccess,
}

const SerialKillerQueries = {view: viewQueryFunc, list: listQueryFunc, save:saveMutateOptions}

export default SerialKillerQueries;