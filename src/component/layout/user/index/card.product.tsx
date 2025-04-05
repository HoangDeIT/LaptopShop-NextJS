
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button } from '@mui/material';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}
interface IProps {
    product: IProduct
}
const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({ expand }) => !expand,
            style: {
                transform: 'rotate(0deg)',
            },
        },
        {
            props: ({ expand }) => !!expand,
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
}));

export default function CardProduct(props: IProps) {
    const { product } = props;
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ maxWidth: 345 }}>

            <CardMedia
                component="img"
                height="194"
                image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/product/${product?.mainImage}`}
                alt="Paella dish"
            />
            <CardContent>
                <Typography variant="body2" sx={{ color: 'back     ', fontWeight: 'bold' }}>
                    {`${product?.name}`}
                </Typography>
                <Typography variant="body2" sx={{
                    color: 'text.secondary',
                    display: "-webkit-box",
                    WebkitLineClamp: 2, // Giới hạn số dòng là 2
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: "1.5",

                }}>
                    {`${product?.name} ,${product?.cpu} ,${product?.ram} ,${product?.rom} ,${product?.screen} ,${product?.os} ,${product?.gpu} ,${product?.type}`}
                </Typography>
                <Typography variant="h5" sx={{ color: 'red', fontWeight: 'bold', textAlign: 'right' }}>
                    {product.price} USD
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                {/* <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton> */}
                <Button>Buy Now</Button>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography sx={{ marginBottom: 2 }}>Type: {product.type}</Typography>

                    <Typography sx={{ marginBottom: 2 }}>Cpu: {product.cpu}</Typography>
                    <Typography sx={{ marginBottom: 2 }}>Gpu: {product.gpu}</Typography>

                    <Typography sx={{ marginBottom: 2 }}>Factory: {product.factory.name}</Typography>
                    <Typography sx={{ marginBottom: 2 }}>OS:{product.os}</Typography>
                    <Typography sx={{ marginBottom: 2 }}>Screen:{product.screen} inch</Typography>
                    <Typography sx={{ marginBottom: 2 }}>Ram:{product.ram} Gb</Typography>
                    <Typography sx={{ marginBottom: 2 }}>Rom:{product.rom} Gb</Typography>

                    <Typography sx={{ marginBottom: 2 }}>
                        {product?.detailDesc}
                    </Typography>

                </CardContent>
            </Collapse>
        </Card>
    );
}
