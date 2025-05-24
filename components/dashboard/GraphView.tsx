'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Panel,
    MarkerType,
    Node,
    Edge,
    NodeMouseHandler,
    Connection,
    ConnectionMode,
    ReactFlowProvider,
    OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import {
    Link,
    LinkIcon,
    ArrowRightLeft,
    ArrowDown,
    CornerDownRight,
} from 'lucide-react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Note = {
    id: string;
    title: string;
    excerpt: string;
    updated: string;
    content: string;
    tags: string[];
};

interface GraphViewProps {
    notes: Note[];
    onSelectNote: (note: Note) => void;
}

// Define connection types
type ConnectionType = 'default' | 'reference' | 'subordinate' | 'bidirectional';

// Define typed node and edge types
type CustomNode = Node<any>;
type CustomEdge = Edge;

// Connection style configurations
const connectionStyles: Record<ConnectionType, Partial<CustomEdge>> = {
    default: {
        animated: false,
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#9E76FF',
        },
        style: { stroke: '#9E76FF', strokeWidth: 1 },
    },
    reference: {
        animated: true,
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#0EA5E9',
        },
        style: { stroke: '#0EA5E9', strokeWidth: 1 },
    },
    subordinate: {
        animated: false,
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#F97316',
        },
        style: { stroke: '#F97316', strokeWidth: 2 },
    },
    bidirectional: {
        animated: false,
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#D946EF',
        },
        markerStart: {
            type: MarkerType.ArrowClosed,
            color: '#D946EF',
        },
        style: { stroke: '#D946EF', strokeWidth: 1 },
    },
};

const GraphView = ({ notes, onSelectNote }: GraphViewProps) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [connectingNodeId, setConnectingNodeId] = useState<string | null>(
        null,
    );
    const [selectedConnectionType, setSelectedConnectionType] =
        useState<ConnectionType>('default');

    // Parse content for links between notes
    const extractLinks = useCallback((notes: Note[]): CustomEdge[] => {
        const newEdges: CustomEdge[] = [];

        notes.forEach((sourceNote) => {
            notes.forEach((targetNote) => {
                // Skip self-links
                if (sourceNote.id === targetNote.id) return;

                // Check if the source note content contains a reference to the target note title
                if (
                    sourceNote.content
                        .toLowerCase()
                        .includes(targetNote.title.toLowerCase())
                ) {
                    newEdges.push({
                        id: `e-${sourceNote.id}-${targetNote.id}`,
                        source: sourceNote.id,
                        target: targetNote.id,
                        ...connectionStyles.default,
                    });
                }
            });
        });

        return newEdges;
    }, []);

    // Create graph data from notes
    useEffect(() => {
        if (!notes.length) return;

        // Create nodes from notes
        const newNodes: CustomNode[] = notes.map((note) => ({
            id: note.id,
            data: {
                label: note.title,
                note,
                primary: false,
            },
            position: {
                x: Math.random() * 500,
                y: Math.random() * 500,
            },
            style: {
                background: '#272530',
                color: '#E8E8EA',
                border: '1px solid #39383F',
                borderRadius: '8px',
                padding: '10px',
                width: 180,
            },
            type: 'default',
        }));

        setNodes(newNodes);

        // Create edges between notes based on content references
        const newEdges = extractLinks(notes);
        setEdges(newEdges);
    }, [notes, extractLinks, setNodes, setEdges]);

    const onConnect: OnConnect = useCallback(
        (params: Connection) => {
            // Ensure required properties exist
            if (!params.source || !params.target) {
                toast.error('Invalid connection parameters');
                return;
            }

            // Create a custom edge ID to prevent duplicates
            const edgeId = `e-${params.source}-${params.target}`;

            // Check if this edge already exists
            const edgeExists = edges.some((edge) => edge.id === edgeId);

            if (edgeExists) {
                toast.error('This connection already exists');
                return;
            }

            // Get the current connection style based on selected type
            const connectionStyle = connectionStyles[selectedConnectionType];

            // Add the new edge with styling
            const newEdge: CustomEdge = {
                id: edgeId,
                source: params.source,
                target: params.target,
                sourceHandle: params.sourceHandle || undefined,
                targetHandle: params.targetHandle || undefined,
                ...connectionStyle,
            };

            setEdges((eds) => addEdge(newEdge, eds));
            toast.success(`Connection created (${selectedConnectionType})`);
            setIsConnecting(false);
            setConnectingNodeId(null);
        },
        [setEdges, edges, selectedConnectionType],
    );

    // Properly typed node click handler
    const onNodeClick: NodeMouseHandler = useCallback(
        (event, node) => {
            // If we're in connecting mode, don't select the node
            if (isConnecting) {
                return;
            }

            // Type assertion since we know the node structure
            const customNode = node as unknown as CustomNode;
            const selectedNote = customNode.data.note;

            if (selectedNote && selectedNote.id) {
                onSelectNote(selectedNote);
            }
        },
        [isConnecting, onSelectNote],
    );

    // Handle starting a connection from a node
    const startConnecting = useCallback(
        (nodeId: string, connectionType: ConnectionType) => {
            setIsConnecting(true);
            setConnectingNodeId(nodeId);
            setSelectedConnectionType(connectionType);
            toast.info('Select another note to connect to', {
                description:
                    'Click on a note to create a connection, or press Escape to cancel',
                duration: 3000,
            });
        },
        [],
    );

    // Cancel connecting mode
    const cancelConnecting = useCallback(() => {
        setIsConnecting(false);
        setConnectingNodeId(null);
    }, []);

    // Handle keyboard escape key to cancel connecting
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isConnecting) {
                cancelConnecting();
                toast.info('Connection cancelled');
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isConnecting, cancelConnecting]);

    // Handle edge deletion
    const onEdgeDelete = useCallback(
        (edgeId: string) => {
            setEdges((edges) => edges.filter((edge) => edge.id !== edgeId));
            toast.success('Connection removed');
        },
        [setEdges],
    );

    // Change connection type of an existing edge
    const changeConnectionType = useCallback(
        (edgeId: string, newType: ConnectionType) => {
            setEdges((edges) =>
                edges.map((edge) => {
                    if (edge.id === edgeId) {
                        return {
                            ...edge,
                            ...connectionStyles[newType],
                        };
                    }
                    return edge;
                }),
            );
            toast.success(`Connection type changed to ${newType}`);
        },
        [setEdges],
    );

    // MiniMap node color function with proper typing
    const getNodeColor = useCallback((node: Node): string => {
        const customNode = node as unknown as CustomNode;
        return customNode.data.primary ? '#9b87f5' : '#555555';
    }, []);

    return (
        <div className='relative h-full w-full overflow-hidden'>
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    connectionMode={ConnectionMode.Loose}
                    fitView
                >
                    <Background color='#39383F' gap={16} />
                    <Controls />
                    <MiniMap
                        nodeColor={getNodeColor}
                        className='!bg-obsidian-dark'
                        maskColor='rgba(0, 0, 0, 0.2)'
                    />

                    <Panel position='top-center' className='text-obsidian-text'>
                        <div className='flex items-center gap-2'>
                            <h3 className='text-lg font-semibold'>
                                Graph View
                            </h3>
                            {isConnecting && (
                                <div className='bg-obsidian-dark border-obsidian-primary text-obsidian-primary flex items-center gap-2 rounded-md border px-2 py-1 text-xs'>
                                    <Link className='h-3 w-3' />
                                    Connecting... (Press ESC to cancel)
                                </div>
                            )}
                        </div>
                    </Panel>

                    <Panel
                        position='top-right'
                        className='text-obsidian-text text-xs'
                    >
                        <div className='bg-obsidian-dark border-obsidian-darkest rounded-md border p-3'>
                            <h4 className='mb-2 font-medium'>
                                Linked mentions
                            </h4>
                            {edges.length > 0 ? (
                                <ul className='text-obsidian-muted'>
                                    {edges.slice(0, 5).map((edge) => {
                                        const sourceNode = nodes.find(
                                            (n) => n.id === edge.source,
                                        );
                                        const targetNode = nodes.find(
                                            (n) => n.id === edge.target,
                                        );

                                        return (
                                            <li
                                                key={edge.id}
                                                className='group mb-1 flex items-center justify-between'
                                            >
                                                <span>
                                                    {sourceNode?.data.label ||
                                                        'Unknown'}{' '}
                                                    →{' '}
                                                    {targetNode?.data.label ||
                                                        'Unknown'}
                                                </span>
                                                <div className='flex items-center gap-1'>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <button className='text-obsidian-muted hover:text-obsidian-text opacity-0 transition-opacity group-hover:opacity-100'>
                                                                <ArrowRightLeft className='h-3 w-3' />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align='end'
                                                            className='w-40'
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    changeConnectionType(
                                                                        edge.id,
                                                                        'default',
                                                                    )
                                                                }
                                                            >
                                                                <Link className='mr-2 h-3 w-3' />{' '}
                                                                Default
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    changeConnectionType(
                                                                        edge.id,
                                                                        'reference',
                                                                    )
                                                                }
                                                            >
                                                                <ArrowDown className='mr-2 h-3 w-3' />{' '}
                                                                Reference
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    changeConnectionType(
                                                                        edge.id,
                                                                        'subordinate',
                                                                    )
                                                                }
                                                            >
                                                                <CornerDownRight className='mr-2 h-3 w-3' />{' '}
                                                                Subordinate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    changeConnectionType(
                                                                        edge.id,
                                                                        'bidirectional',
                                                                    )
                                                                }
                                                            >
                                                                <ArrowRightLeft className='mr-2 h-3 w-3' />{' '}
                                                                Bidirectional
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <button
                                                        onClick={() =>
                                                            onEdgeDelete(
                                                                edge.id,
                                                            )
                                                        }
                                                        className='text-obsidian-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400'
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                    {edges.length > 5 && (
                                        <li>+ {edges.length - 5} more</li>
                                    )}
                                </ul>
                            ) : (
                                <p className='text-obsidian-muted'>
                                    No backlinks found.
                                </p>
                            )}

                            <h4 className='mt-4 mb-2 font-medium'>
                                Create connections
                            </h4>
                            <p className='text-obsidian-muted mb-2'>
                                Right-click on a note to start connecting
                            </p>

                            <Button
                                variant='outline'
                                size='sm'
                                className='bg-obsidian-dark border-obsidian-accent/50 text-obsidian-accent hover:bg-obsidian-accent/20 w-full text-xs'
                                onClick={() => setIsConnecting(!isConnecting)}
                            >
                                <Link className='mr-1 h-3 w-3' />
                                {isConnecting
                                    ? 'Cancel connecting'
                                    : 'Connect notes'}
                            </Button>

                            {/* Connection type selection */}
                            {!isConnecting && (
                                <div className='mt-3'>
                                    <h4 className='mb-2 font-medium'>
                                        Connection types
                                    </h4>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            className={`text-xs ${selectedConnectionType === 'default' ? 'bg-obsidian-accent/20' : 'bg-obsidian-dark'}`}
                                            onClick={() =>
                                                setSelectedConnectionType(
                                                    'default',
                                                )
                                            }
                                        >
                                            <LinkIcon className='mr-1 h-3 w-3 text-[#9E76FF]' />
                                            Default
                                        </Button>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            className={`text-xs ${selectedConnectionType === 'reference' ? 'bg-obsidian-accent/20' : 'bg-obsidian-dark'}`}
                                            onClick={() =>
                                                setSelectedConnectionType(
                                                    'reference',
                                                )
                                            }
                                        >
                                            <ArrowDown className='mr-1 h-3 w-3 text-[#0EA5E9]' />
                                            Reference
                                        </Button>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            className={`text-xs ${selectedConnectionType === 'subordinate' ? 'bg-obsidian-accent/20' : 'bg-obsidian-dark'}`}
                                            onClick={() =>
                                                setSelectedConnectionType(
                                                    'subordinate',
                                                )
                                            }
                                        >
                                            <CornerDownRight className='mr-1 h-3 w-3 text-[#F97316]' />
                                            Subordinate
                                        </Button>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            className={`text-xs ${selectedConnectionType === 'bidirectional' ? 'bg-obsidian-accent/20' : 'bg-obsidian-dark'}`}
                                            onClick={() =>
                                                setSelectedConnectionType(
                                                    'bidirectional',
                                                )
                                            }
                                        >
                                            <ArrowRightLeft className='mr-1 h-3 w-3 text-[#D946EF]' />
                                            Bidirectional
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Panel>
                </ReactFlow>
            </ReactFlowProvider>

            {/* Context menu for nodes */}
            {nodes.map((node) => (
                <ContextMenu key={node.id}>
                    <ContextMenuTrigger
                        id={`node-${node.id}`}
                        className='absolute'
                        style={{
                            width: (node.style?.width as number) || 180,
                            height: (node.style?.height as number) || 'auto',
                            left: node.position.x,
                            top: node.position.y,
                            zIndex: 10,
                            pointerEvents: 'none',
                        }}
                    />
                    <ContextMenuContent>
                        <ContextMenuItem
                            onClick={() => onSelectNote(node.data.note)}
                        >
                            Open note
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() => startConnecting(node.id, 'default')}
                        >
                            <Link className='mr-2 h-3 w-3 text-[#9E76FF]' />{' '}
                            Connect (Default)
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() =>
                                startConnecting(node.id, 'reference')
                            }
                        >
                            <ArrowDown className='mr-2 h-3 w-3 text-[#0EA5E9]' />{' '}
                            Connect (Reference)
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() =>
                                startConnecting(node.id, 'subordinate')
                            }
                        >
                            <CornerDownRight className='mr-2 h-3 w-3 text-[#F97316]' />{' '}
                            Connect (Subordinate)
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() =>
                                startConnecting(node.id, 'bidirectional')
                            }
                        >
                            <ArrowRightLeft className='mr-2 h-3 w-3 text-[#D946EF]' />{' '}
                            Connect (Bidirectional)
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
            ))}
        </div>
    );
};

export default GraphView;
