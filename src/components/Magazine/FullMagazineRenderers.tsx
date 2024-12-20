'use client'
import { PINATA_URL } from '@/utils/config';
import { Divider, Image } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';

type MarkdownProps = {
    node?: any;
    alt?: any;
    src?: any;
    title?: any;
};

type RendererProps = MarkdownProps & {
    children?: React.ReactNode;
    ordered?: any;
    href?: any;
};


const VideoRenderer = ({ src, ...props }: RendererProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [poster, setPoster] = useState<string>('/home_animation_body.gif');
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            const captureThumbnail = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const context = canvas.getContext('2d');
                if (context) {
                    video.currentTime = 2;
                    video.addEventListener('seeked', function capture() {
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        setPoster(canvas.toDataURL('image/jpeg'));
                        video.removeEventListener('seeked', capture);
                    });
                }
            };
            if (video.readyState >= 2) {
                captureThumbnail();
            } else {
                video.addEventListener('loadeddata', captureThumbnail);
            }
        }
    }, [src]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handlePlay = () => {
            if (!videoRef.current) return;
            videoRef.current.play();
            setIsPlaying(true);
        };

        const handlePause = () => {
            setIsPlaying(false);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        handlePlay();
                    } else {
                        handlePause();
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(video);

        return () => {
            observer.unobserve(video);
        };
    }, [src]);

    return (
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px', minWidth: '100%', minHeight: 'auto' }}>
            <picture>
                <video
                    {...props}
                    muted={true}
                    loop={true}
                    ref={videoRef}
                    src={src && typeof src === 'string' ? src.replace("ipfs.skatehive.app", PINATA_URL) : ""}
                    poster={poster}
                    crossOrigin='anonymous'
                    playsInline={false}
                    style={{ background: 'transparent', borderRadius: '10px', marginBottom: '20px', border: '0px grey solid', width: '100%', minHeight: '50%', maxHeight: '420px' }}
                />
            </picture>
        </div>
    );
};

export const FullMagazineRenderers = {
    img: ({ alt, src, title, ...props }: RendererProps) => (
        <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Image
                {...props}
                alt={alt}
                src={src && typeof src === 'string' ? src.replace("ipfs.skatehive.app", PINATA_URL) : ""}
                title={title}
                style={{
                    display: 'inline-block',
                    maxWidth: '100%',
                    height: '100%',
                    borderRadius: '10px',
                    marginTop: '20px',
                    marginBottom: '20px',
                    minHeight: '425px',
                    maxHeight: '625px',
                }}
            />
        </span>
    ),

    p: ({ children, ...props }: RendererProps) => (
        <div {...props} style={{ color: 'white', fontSize: '16px', paddingBottom: '5px' }}>
            {children}
        </div>
    ),
    a: ({ href, children, ...props }: RendererProps) => (
        <a style={{ color: "yellow", textWrap: "wrap", wordBreak: "break-all" }} href={href} {...props}>{children}</a>
    ),
    h1: ({ children, ...props }: RendererProps) => (
        <h1 {...props} style={{ fontWeight: 'bold', color: '#A5D6A7', fontSize: '22px', paddingBottom: '8px', paddingTop: "8px", paddingLeft: '4px' }}>🛹 {children}</h1>
    ),
    h3: ({ children, ...props }: RendererProps) => (
        <h3 {...props} style={{ fontWeight: 'bold', color: '#A5D6A7', fontSize: '20px', paddingBottom: '4px', paddingTop: "4px", paddingLeft: '4px' }}>🛹 {children}</h3>
    ),
    h2: ({ children, ...props }: RendererProps) => (
        <h2 {...props} style={{ fontWeight: 'bold', color: '#A5D6A7', fontSize: '18px', paddingBottom: '2px', paddingTop: "2px", paddingLeft: '4px' }}>🛹 {children}</h2>
    ),
    h4: ({ children, ...props }: RendererProps) => (
        <h4 {...props} style={{ fontWeight: 'bold', color: '#A5D6A7', fontSize: '16px', paddingBottom: '1px', paddingTop: "1px", paddingLeft: '4px' }}>🛹 {children}</h4>
    ),
    em: ({ children, ...props }: RendererProps) => (
        <em {...props} style={{ color: '#A5D6A7' }}>{children}</em>
    ),
    blockquote: ({ children, ...props }: RendererProps) => (
        <div
            style={{
                backgroundColor: '#004d1a',
                padding: '10px',
                borderLeft: '4px solid  #A5D6A7',
                margin: '10px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                fontStyle: 'italic',
                fontWeight: 'bold',
                fontSize: '14px',
                lineHeight: '1',
            }}
        >
            {children}
        </div>
    ),
    ol: ({ ordered, children, ...props }: RendererProps) => {
        const listType = ordered ? "1" : "decimal";
        return <ol {...props} style={{ listStyleType: listType, paddingLeft: '10%' }}>{children}</ol>;
    },
    ul: ({ ordered, children, ...props }: RendererProps) => {
        const listType = ordered ? "1" : "decimal";
        return <ul {...props} data-ordered={listType} style={{ padding: '5%', paddingLeft: '10%', color: 'white' }}>{children}</ul>;
    },
    li: ({ children, ...props }: RendererProps) => (
        <li {...props} style={{ paddingBottom: '5px', color: '#A5D6A7' }}>{children}</li>
    ),
    sub: ({ children, ...props }: RendererProps) => (
        <sub {...props} style={{ color: 'gray' }}>{children}</sub>
    ),
    hr: ({ children, ...props }: RendererProps) => (
        <Divider {...props} variant={'dashed'} style={{ paddingBottom: '20px', color: 'limegreen', marginBottom: '5px' }}>{children}</Divider>
    ),
    br: ({ children, ...props }: RendererProps) => (
        <br {...props} style={{ paddingBottom: '20px' }}>{children}</br>
    ),
    pre: ({ children, ...props }: RendererProps) => (
        <div
            style={{
                backgroundColor: '#1E1E1E',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                overflowX: 'auto',
            }}
        >
            <center>
                <code
                    {...props}
                    style={{
                        color: 'red',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        lineHeight: '1.5',
                    }}
                >
                    {children}
                </code>
            </center>
        </div>
    ),
    sup: ({ children, ...props }: RendererProps) => (
        <sup {...props} style={{ color: 'lightgray', fontSize: '14px' }}>{children}</sup>
    ),
    iframe: ({ src, ...props }: RendererProps) => (
        <center>
            <iframe
                {...props}
                src={src && typeof src === 'string' ? src.replace("ipfs.skatehive.app", PINATA_URL) : ""}
                style={{ borderRadius: '10px', marginBottom: '10px', maxWidth: '100%', minWidth: '100%', aspectRatio: '16/9', height: '100%', border: '2px grey solid' }}
            />
        </center>
    ),
    video: ({ src, ...props }: RendererProps) => (
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px', minWidth: '100%', minHeight: 'auto' }}>
            <picture>
                <video
                    {...props}
                    muted={true}
                    loop={true}
                    src={src}
                    crossOrigin='anonymous'
                    playsInline={false}
                    style={{ background: 'transparent', borderRadius: '10px', marginBottom: '20px', border: '0px grey solid', width: '100%', minHeight: '50%', maxHeight: '540px' }}
                />
            </picture>
        </div>
    ),
    table: ({ children, ...props }: RendererProps) => (
        <div style={{
            display: 'flex', justifyContent: 'center',
            border: '1px solid none',
            borderRadius: '10px',
            padding: '10px',
            overflowX: 'auto',
        }}>
            <table
                {...props}
                style={{
                    border: '1px solid transparent',
                    borderCollapse: 'collapse',
                    margin: '0 auto',
                    width: '100%',
                    maxWidth: '100%',
                }}
            >
                {children}
            </table>
        </div>
    ),
    tbody: ({ children, ...props }: RendererProps) => (
        <tbody {...props}>{children}</tbody>
    ),
    tr: ({ children, ...props }: RendererProps) => (
        <tr {...props}>{children}</tr>
    ),
    th: ({ children, ...props }: RendererProps) => (
        <th
            {...props}
            style={{
                border: '1px solid black',
                backgroundColor: '#009933',
                padding: '8px',
                fontWeight: 'bold',
                textAlign: 'left',
                color: '#004d1a',
            }}
        >
            {children}
        </th>
    ),
    td: ({ children, ...props }: RendererProps) => (
        <td
            {...props}
            style={{
                border: '1px solid #A6E22E',
                backgroundColor: '#001a09',
                padding: '8px',
                textAlign: 'left',
                color: '#A5D6A7',
            }}
        >
            {children}
        </td>
    ),
    strong: ({ children, ...props }: RendererProps) => (
        <strong {...props} style={{ color: '#A5D6A7' }}>{children}</strong>
    ),
    code: ({ children, ...props }: RendererProps) => (
        <code {...props} style={{ color: '#A6E22E', backgroundColor: '#001a09', padding: '2px', borderRadius: '4px' }}>{children}</code>
    )
};
