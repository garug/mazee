use itertools::Itertools;
use std::collections::{HashMap, VecDeque};

struct Maze {
    grid: Vec<Vec<char>>,
}

struct HeatmapResult {
    by_pos: HashMap<(usize, usize), usize>,
    by_dist: Vec<Vec<(usize, usize)>>,
}

fn bfs_heatmap(maze: &Maze, start: (usize, usize)) -> HeatmapResult {
    let (rows, cols) = (maze.grid.len(), maze.grid[0].len());
    let directions = [(0, 1), (1, 0), (0, -1), (-1, 0)];
    let mut visited = vec![vec![false; cols]; rows];
    let mut by_pos = HashMap::new();
    let mut by_dist: HashMap<usize, Vec<(usize, usize)>> = HashMap::new();
    let mut queue = VecDeque::from([(start.0, start.1, 0)]);

    visited[start.0][start.1] = true;
    by_pos.insert(start, 0);
    by_dist.entry(0).or_default().push(start);

    while let Some((r, c, dist)) = queue.pop_front() {
        for (dr, dc) in directions {
            let (nr, nc) = (r as isize + dr, c as isize + dc);
            if (0..rows as isize).contains(&nr)
                && (0..cols as isize).contains(&nc)
                && !visited[nr as usize][nc as usize]
                && maze.grid[nr as usize][nc as usize] != '#'
            {
                let (nr, nc) = (nr as usize, nc as usize);
                visited[nr][nc] = true;
                by_pos.insert((nr, nc), dist + 1);
                by_dist.entry(dist + 1).or_default().push((nr, nc));
                queue.push_back((nr, nc, dist + 1));
            }
        }
    }

    HeatmapResult {
        by_pos,
        by_dist: by_dist
            .iter()
            .sorted_by(|a, b| b.cmp(a))
            .map(|(_, b)| b.clone())
            .collect(),
    }
}

fn place_items_by_rarity(
    heatmap: &HeatmapResult,
    items_by_rarity: &[usize],
) -> Vec<(usize, usize, usize)> {
    use rand::prelude::*;
    use std::collections::HashMap;

    let mut rng = rand::rng();
    let mut placed: HashMap<(usize, usize), usize> = HashMap::new();
    let mut by_dist = heatmap.by_dist.clone();

    let mut dist = 0;

    for (rarity, quant_items) in items_by_rarity
        .iter()
        .sorted_by(|a, b| a.cmp(b))
        .enumerate()
    {
        for _ in 0..*quant_items {
            loop {
                if let Some(positions) = by_dist.get_mut(dist) {
                    if positions.is_empty() {
                        dist += 1;
                        continue;
                    }

                    let pos = if positions.len() == 1 {
                        positions.remove(0)
                    } else {
                        let &chosen = positions.choose(&mut rng).unwrap();
                        positions.retain(|x| x != &chosen);
                        chosen
                    };

                    placed.insert(pos, rarity);
                    break;
                } else {
                    dist += 1;
                }
            }
        }
        dist += 1;
    }

    placed
        .into_iter()
        .map(|((row, col), rarity)| (row, col, rarity))
        .collect()
}

fn main() {
    let maze = Maze {
        grid: vec![
            vec!['.', '.', '.', '#', '.'],
            vec!['#', '#', '.', '#', '.'],
            vec!['.', '.', '.', '.', '.'],
            vec!['.', '#', '#', '.', '.'],
            vec!['.', '.', '.', '.', '.'],
        ],
    };

    let start = (3, 3);

    let result = bfs_heatmap(&maze, start);

    let rarity_levels = vec![3, 2, 1];

    let items_by_rarity = place_items_by_rarity(&result, &rarity_levels);

    for (row_idx, row) in maze.grid.iter().enumerate() {
        print!("|");
        for (col_idx, c) in row.iter().enumerate() {
            if let Some((_, _, rarity)) = items_by_rarity
                .iter()
                .find(|(row_item, col_item, _)| col_item == &col_idx && row_item == &row_idx)
            {
                print!(
                    " {}",
                    match rarity {
                        0 => '★', // Legendary
                        1 => '☆', // Rare
                        2 => '✦', // Uncommon
                        _ => '✧', // Common
                    }
                );
            } else {
                print!(" {}", c);
            }
        }
        println!(" |");
    }
}
