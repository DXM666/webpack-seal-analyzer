import { Chunk, Module, Compilation, ChunkGroup } from 'webpack';
import { ChunkInfo } from '../types';

export class ChunkAnalyzer {
    static getChunkInfo(chunk: Chunk, compilation: Compilation): ChunkInfo {
        const chunkGraph = compilation.chunkGraph;
        const modules = Array.from(chunkGraph.getChunkModules(chunk)) as Module[];
        const totalSize = modules.reduce((sum, module) => sum + module.size(), 0);

        return {
            id: chunk.id,
            name: chunk.name,
            size: totalSize,
            files: Array.from(chunk.files),
            modules: modules.map(module => module.identifier()),
            parents: Array.from(chunk.groupsIterable, group => 
                Array.from(group.parentsIterable, parent => (parent as ChunkGroup).name || (parent as ChunkGroup).id?.toString() || '')
            ).flat().filter(Boolean),
            children: Array.from(chunk.groupsIterable, group => 
                Array.from(group.childrenIterable, child => (child as ChunkGroup).name || (child as ChunkGroup).id?.toString() || '')
            ).flat().filter(Boolean),
            siblings: Array.from(chunk.groupsIterable, group => {
                const parentGroup = Array.from(group.parentsIterable)[0] as ChunkGroup;
                if (!parentGroup) return [];
                return Array.from(parentGroup.chunks)
                    .map(sibling => sibling.name || sibling.id?.toString() || '')
                    .filter(id => id !== (chunk.name || chunk.id?.toString()));
            }).flat().filter(Boolean),
            entrypoints: Array.from(compilation.entrypoints.entries())
                .filter(([, entrypoint]) => entrypoint.chunks.includes(chunk))
                .map(([name]) => name),
        };
    }
}
