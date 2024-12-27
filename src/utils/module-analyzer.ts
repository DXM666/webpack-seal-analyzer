import { Module, ModuleGraphConnection, Compilation } from 'webpack';
import { ModuleInfo } from '../types';

export class ModuleAnalyzer {
    static getModuleInfo(module: Module, compilation: Compilation): ModuleInfo {
        const moduleGraph = compilation.moduleGraph;
        const reasons = Array.from(moduleGraph.getIncomingConnections(module)) as ModuleGraphConnection[];
        const exports = moduleGraph.getExportsInfo(module).getUsedExports(undefined) || [];
        const optimizationBailout = moduleGraph.getOptimizationBailout(module) || [];

        return {
            id: module.identifier(),
            type: module.type,
            size: module.size(),
            name: module.identifier(),
            dependencies: Array.from(moduleGraph.getOutgoingConnections(module))
                .map((connection: ModuleGraphConnection) => connection.module?.identifier() || '')
                .filter(Boolean),
            exports: typeof exports === 'boolean' ? [] : Array.from(exports || []),
            issuerPath: this.getModuleIssuerPath(module, moduleGraph),
            reasons: reasons.map(connection => 
                `${(connection.originModule as Module)?.identifier() || 'unknown'} (${connection.explanation || 'unknown reason'})`
            ),
            optimizationBailout: optimizationBailout.map(bailout => 
                typeof bailout === 'string' ? bailout : bailout({ shorten: (s: string) => s, contextify: (s: string) => s })
            ),
            circularDependencies: this.findCircularDependencies(module, moduleGraph),
            duplicateDependencies: this.findDuplicateDependencies(module, moduleGraph),
        };
    }

    private static findCircularDependencies(module: Module, moduleGraph: any, visited = new Set<string>(), path: string[] = []): string[][] {
        const cycles: string[][] = [];
        const moduleId = module.identifier();

        if (visited.has(moduleId)) {
            const cycleStart = path.indexOf(moduleId);
            if (cycleStart !== -1) {
                cycles.push(path.slice(cycleStart));
            }
            return cycles;
        }

        visited.add(moduleId);
        path.push(moduleId);

        const outgoingConnections = Array.from(moduleGraph.getOutgoingConnections(module)) as ModuleGraphConnection[];
        const dependencies = outgoingConnections
            .map(connection => connection.module)
            .filter((dep): dep is Module => dep !== null && dep !== undefined);

        for (const dependency of dependencies) {
            const subCycles = this.findCircularDependencies(dependency, moduleGraph, visited, [...path]);
            cycles.push(...subCycles);
        }

        visited.delete(moduleId);
        path.pop();

        return cycles;
    }

    private static findDuplicateDependencies(module: Module, moduleGraph: any): string[] {
        const outgoingConnections = Array.from(moduleGraph.getOutgoingConnections(module)) as ModuleGraphConnection[];
        const dependencies = outgoingConnections
            .map(connection => connection.module?.identifier())
            .filter((id): id is string => id !== undefined);

        return dependencies.filter((id, index) => dependencies.indexOf(id) !== index);
    }

    private static getModuleIssuerPath(module: Module, moduleGraph: any): string[] {
        const path: string[] = [];
        let current = module;
        
        while (current) {
            path.unshift(current.identifier());
            const issuer = moduleGraph.getIssuer(current);
            if (!issuer || path.includes(issuer.identifier())) break;
            current = issuer;
        }
        
        return path;
    }
}
