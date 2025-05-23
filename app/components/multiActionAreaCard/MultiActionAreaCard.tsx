"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import { FaRegHeart, FaHeart, FaShare } from "react-icons/fa";
import { MultiActionAreaCardProps } from "@/app/types/interfaces";

import { useSelector, useDispatch } from 'react-redux';
import type { AppState, AppDispatch } from "@/app/store/store";
import { toggleLike } from "./LikeSlice";

export default function MultiActionAreaCard({
  id,
  image,
  alt,
  title,
  description,
}: MultiActionAreaCardProps) {
  const isLike = useSelector((state: AppState) => state.like.likes[id]);
  const dispatch: AppDispatch = useDispatch();

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia component="img" className="h-52" image={image} alt={alt} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className="justify-end">
        <IconButton aria-label="compartilhar">
          <FaShare size={24} className="text-gray-500" />
        </IconButton>
        <IconButton aria-label="curtir" onClick={() => dispatch(toggleLike(id))}>
          {isLike ? (
            <FaHeart size={24} className="text-red-500" />
          ) : (
            <FaRegHeart size={24} className="text-gray-500" />
          )}
        </IconButton>
      </CardActions>
    </Card>
  );
}
